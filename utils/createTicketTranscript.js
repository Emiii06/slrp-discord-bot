const PDFDocument = require("pdfkit");

async function fetchAllMessages(channel) {
    const messages = [];
    let lastId;

    while (true) {
        const options = {
            limit: 100
        };

        if (lastId) {
            options.before = lastId;
        }

        const batch = await channel.messages.fetch(options);

        if (batch.size === 0) {
            break;
        }

        messages.push(...batch.values());

        lastId = batch.last().id;

        if (batch.size < 100) {
            break;
        }
    }

    return messages.sort(
        (a, b) => a.createdTimestamp - b.createdTimestamp
    );
}

function safeText(text) {
    if (!text) {
        return "";
    }

    return text
        .replace(/\r/g, "")
        .replace(/\u0000/g, "");
}

async function createTicketTranscript(
    channel,
    {
        ticketType,
        creator,
        closedBy
    }
) {
    const messages = await fetchAllMessages(channel);

    return new Promise((resolve, reject) => {
        const chunks = [];

        const doc = new PDFDocument({
            size: "A4",
            margin: 50,
            bufferPages: true
        });

        doc.on("data", chunk => chunks.push(chunk));

        doc.on("end", () => {
            resolve(Buffer.concat(chunks));
        });

        doc.on("error", reject);

        /*
        ========================================
        HEADER
        ========================================
        */

        doc
            .fontSize(22)
            .text("STATE LINE ROLEPLAY", {
                align: "center"
            });

        doc
            .moveDown(0.5)
            .fontSize(16)
            .text("Ticket Transcript", {
                align: "center"
            });

        doc.moveDown();

        doc
            .fontSize(10)
            .text(`Ticket: ${channel.name}`)
            .text(`Ticket Type: ${ticketType}`)
            .text(
                `Created By: ${creator?.username || "Unknown"} (${creator?.id || "Unknown"})`
            )
            .text(
                `Created At: ${new Date(
                    channel.createdTimestamp
                ).toLocaleString("en-GB")}`
            )
            .text(
                `Closed By: ${closedBy?.username || "Unknown"} (${closedBy?.id || "Unknown"})`
            )
            .text(
                `Closed At: ${new Date().toLocaleString("en-GB")}`
            );

        doc.moveDown();

        doc
            .moveTo(50, doc.y)
            .lineTo(545, doc.y)
            .stroke();

        doc.moveDown();

        /*
        ========================================
        MESSAGES
        ========================================
        */

        for (const message of messages) {

            if (doc.y > 720) {
                doc.addPage();
            }

            const timestamp = new Date(
                message.createdTimestamp
            ).toLocaleString("en-GB");

            doc
                .fontSize(11)
                .text(
                    `${message.author.username} (${message.author.id})`,
                    {
                        continued: true
                    }
                )
                .fontSize(8)
                .text(`  •  ${timestamp}`);

            doc.moveDown(0.2);

            const content = safeText(message.content);

            if (content) {
                doc
                    .fontSize(10)
                    .text(content);
            }

            /*
            ========================================
            ATTACHMENTS
            ========================================
            */

            if (message.attachments.size > 0) {
                doc.moveDown(0.2);

                doc
                    .fontSize(9)
                    .text("Attachments:");

                for (const attachment of message.attachments.values()) {
                    doc
                        .fontSize(8)
                        .fillColor("#444444")
                        .text(
                            `${attachment.name}: ${attachment.url}`
                        )
                        .fillColor("#000000");
                }
            }

            /*
            ========================================
            EMBEDS
            ========================================
            */

            if (message.embeds.length > 0) {
                for (const embed of message.embeds) {

                    if (embed.title) {
                        doc
                            .moveDown(0.2)
                            .fontSize(9)
                            .text(
                                `Embed Title: ${safeText(embed.title)}`
                            );
                    }

                    if (embed.description) {
                        doc
                            .fontSize(8)
                            .text(
                                safeText(embed.description)
                            );
                    }
                }
            }

            doc.moveDown(0.8);

            doc
                .moveTo(50, doc.y)
                .lineTo(545, doc.y)
                .stroke();

            doc.moveDown(0.5);
        }

        /*
        ========================================
        FOOTER
        ========================================
        */

        const range = doc.bufferedPageRange();

        for (
            let i = range.start;
            i < range.start + range.count;
            i++
        ) {
            doc.switchToPage(i);

            doc
                .fontSize(8)
                .fillColor("#666666")
                .text(
                    `State Line Roleplay • Ticket Transcript • Page ${i + 1 - range.start} of ${range.count}`,
                    50,
                    780,
                    {
                        align: "center",
                        width: 495
                    }
                )
                .fillColor("#000000");
        }

        doc.end();
    });
}

module.exports = createTicketTranscript;