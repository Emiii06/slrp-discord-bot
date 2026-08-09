/*
====================================================
STATE LINE ROLEPLAY
APPLICATION DATA
====================================================
*/

const personalInformation = [
    {
        id: "discord_username",
        label: "Discord Username",
        question: "What is your Discord username?",
        placeholder: "Enter your Discord username."
    },
    {
        id: "roblox_username",
        label: "Roblox Username",
        question: "What is your Roblox username?",
        placeholder: "Enter your Roblox username."
    },
    {
        id: "age",
        label: "Age",
        question: "How old are you?",
        placeholder: "Enter your age."
    },
    {
        id: "timezone",
        label: "Timezone",
        question: "What is your timezone?",
        placeholder: "Example: EST, CST, GMT, CET."
    },
    {
        id: "slrp_membership",
        label: "SLRP Membership",
        question: "How long have you been a member of State Line Roleplay?",
        placeholder: "Explain how long you have been in SLRP."
    },
    {
        id: "previous_experience",
        label: "Previous Experience",
        question: "Describe any previous experience relevant to this application.",
        placeholder: "Describe your previous experience."
    },
    {
        id: "previous_department",
        label: "Previous Department Experience",
        question: "Have you previously served in another SLRP department or staff position? If yes, explain.",
        placeholder: "Explain your previous department or staff experience."
    }
];


/*
====================================================
STAFF APPLICATION
====================================================
*/

const staffQuestions = [

    {
        id: "staff_1",
        label: "1. Staff Judgment",
        question:
            "You witness a player breaking a rule, but their actions appear to have been caused by another player's actions. What should you do FIRST?\n\n" +
            "A. Immediately punish the player you saw\n" +
            "B. Ignore the situation\n" +
            "C. Investigate the entire situation, determine context, review evidence, and identify which rules apply\n" +
            "D. Punish everyone involved equally",
        placeholder: "Write your answer."
    },

    {
        id: "staff_2",
        label: "2. Investigations",
        question:
            "Which approach demonstrates the BEST staff judgment?\n\n" +
            "A. Believe the first person who reports\n" +
            "B. Believe the person with the highest rank\n" +
            "C. Review evidence, hear relevant sides, identify the applicable rule, and document your decision\n" +
            "D. Ask your friends who they believe",
        placeholder: "Write your answer."
    },

    {
        id: "staff_3",
        label: "3. Staff Permissions",
        question:
            "Which is an appropriate use of staff permissions?\n\n" +
            "A. Teleporting to a friend because you want to join their RP\n" +
            "B. Using moderation tools to investigate or resolve a legitimate incident\n" +
            "C. Using commands to give yourself an advantage\n" +
            "D. Using commands because you are bored",
        placeholder: "Write your answer."
    },

    {
        id: "staff_4",
        label: "4. Punishments",
        question:
            "Which factors may appropriately be considered when determining punishment?\n\n" +
            "A. Severity of the violation\n" +
            "B. Previous violations\n" +
            "C. Intent and impact\n" +
            "D. Available evidence\n" +
            "E. All of the above",
        placeholder: "Write your answer."
    },

    {
        id: "staff_5",
        label: "5. Promotions",
        question:
            "Which staff member is MOST deserving of promotion?\n\n" +
            "A. A popular but inactive staff member\n" +
            "B. Someone constantly asking for promotion\n" +
            "C. An active staff member demonstrating professionalism, good judgment, teamwork, rule knowledge, and reliable performance\n" +
            "D. Someone with the most friends",
        placeholder: "Write your answer."
    },

    {
        id: "staff_6",
        label: "6. Staff Authority",
        question:
            "A staff member may ignore a rule violation if enforcing the rule would negatively affect their friendship with the player.\n\n" +
            "Answer True or False.",
        placeholder: "True or False?"
    },

    {
        id: "staff_7",
        label: "7. Confidentiality",
        question:
            "Private staff discussions, investigations, reports, and internal decisions should remain confidential unless leadership authorizes otherwise.\n\n" +
            "Answer True or False.",
        placeholder: "True or False?"
    },

    {
        id: "staff_8",
        label: "8. Staff Accountability",
        question:
            "A staff member should be held accountable for breaking rules even if they have a high-ranking position.\n\n" +
            "Answer True or False.",
        placeholder: "True or False?"
    },

    {
        id: "staff_9",
        label: "9. Demotions",
        question:
            "A staff member may be demoted for inactivity, poor performance, favoritism, abuse of permissions, repeated rule violations, or failure to complete responsibilities.\n\n" +
            "Answer True or False.",
        placeholder: "True or False?"
    },

    {
        id: "staff_10",
        label: "10. Freedom Friday",
        question:
            "Freedom Friday removes the normal SLRP rules and allows players to participate in FRP, VDM, RDM, and other normally prohibited behavior.\n\n" +
            "Answer True or False.",
        placeholder: "True or False?"
    },

    {
        id: "staff_11",
        label: "11. Staff Authority",
        question:
            "Explain the difference between using staff authority responsibly and abusing staff authority.",
        placeholder: "Write your answer."
    },

    {
        id: "staff_12",
        label: "12. Professionalism",
        question:
            "What does being a professional SLRP staff member mean to you?",
        placeholder: "Write your answer."
    },

    {
        id: "staff_13",
        label: "13. Leading By Example",
        question:
            "What does \"leading by example\" mean in SLRP? Give two examples.",
        placeholder: "Write your answer."
    },

    {
        id: "staff_14",
        label: "14. Freedom Friday",
        question:
            "What is Freedom Friday intended to provide? List four rules that still apply during Freedom Friday.",
        placeholder: "Write your answer."
    },

    {
        id: "staff_15",
        label: "15. Staff Mistakes",
        question:
            "If you make a moderation mistake, what should you do?",
        placeholder: "Write your answer."
    },

    {
        id: "staff_16",
        label: "16. Conflicting Reports",
        question:
            "Two players report each other. One provides a short video while the other provides screenshots showing an earlier part of the incident.\n\n" +
            "Explain how you would investigate the situation before making a decision.",
        placeholder: "Write your complete response."
    },

    {
        id: "staff_17",
        label: "17. Friend Violating Rules",
        question:
            "Your closest friend clearly breaks a rule while you are moderating.\n\n" +
            "What do you do, and how do you prevent your friendship from influencing your decision?",
        placeholder: "Write your complete response."
    },

    {
        id: "staff_18",
        label: "18. Leadership Disagreement",
        question:
            "A higher-ranking staff member makes a decision you believe is incorrect while players are watching.\n\n" +
            "What do you do during the situation, and what do you do afterward?",
        placeholder: "Write your complete response."
    },

    {
        id: "staff_19",
        label: "19. Curfew Enforcement",
        question:
            "Curfew is enabled.\n\n" +
            "At 8:30 PM, a business is still operating normally.\n\n" +
            "At 10:45 PM, several civilians are driving around with no emergency or approved RP reason.\n\n" +
            "Explain how you would handle both situations.",
        placeholder: "Write your complete response."
    },

    {
        id: "staff_20",
        label: "20. Special Roleplay Sunday",
        question:
            "During SRS, a player intentionally drives through an emergency scene, blocks responders, and claims they are \"making the RP realistic.\"\n\n" +
            "How would you determine whether this is legitimate RP or disruption?",
        placeholder: "Write your complete response."
    },

    {
        id: "staff_21",
        label: "21. Session Preparation",
        question:
            "You are assigned as Session Host. Two moderators are available, but there is no event coordinator, no finalized scenario, no staff assignments, and no session announcement.\n\n" +
            "Explain what you would do before starting the session and what you would prioritize.",
        placeholder: "Write your complete response."
    },

    {
        id: "staff_22",
        label: "22. Difficult Player",
        question:
            "You issue a legitimate punishment. The player begins insulting you, calls you corrupt, and encourages other players to argue with you.\n\n" +
            "Write how you would respond professionally.",
        placeholder: "Write your response."
    },

    {
        id: "staff_23",
        label: "23. Staff Report",
        question:
            "A player reports a staff member for abuse of power. The evidence is limited, but the accusation is serious.\n\n" +
            "Explain how you would handle the report without automatically assuming either side is guilty.",
        placeholder: "Write your complete response."
    },

    {
        id: "staff_24",
        label: "24. Complete Investigation",
        question:
            "You are the only available moderator during a major incident.\n\n" +
            "You receive:\n" +
            "• A 12-second video\n" +
            "• Two conflicting witness statements\n" +
            "• One screenshot\n" +
            "• A previous report involving the accused\n" +
            "• A report from someone directly involved\n\n" +
            "Explain your investigation from beginning to end, including evidence, witnesses, previous history, escalation, punishment, and documentation.",
        placeholder: "Write your complete response."
    },

    {
        id: "staff_25",
        label: "25. Staff Responsibility",
        question:
            "You are accepted onto the SLRP Staff Team.\n\n" +
            "Six months later, you are dealing with:\n\n" +
            "• A close friend repeatedly breaking rules\n" +
            "• Players criticizing your decisions\n" +
            "• A disagreement with another staff member\n" +
            "• A leadership decision you disagree with\n" +
            "• A large session requiring moderation\n" +
            "• A mistake you made that affected a player\n\n" +
            "Explain how you would handle everything while maintaining professionalism, fairness, confidentiality, teamwork, and accountability.\n\n" +
            "Your answer should explain what you would do, why you would do it, and how you would prevent personal feelings from affecting your decisions.",
        placeholder: "Write your complete response."
    }

];


/*
====================================================
POLICE APPLICATION
====================================================
*/

const policeInformation = [
    {
        id: "discordUsername",
        label: "Discord Username",
        placeholder: "Enter your Discord username."
    },
    {
        id: "robloxUsername",
        label: "Roblox Username",
        placeholder: "Enter your Roblox username."
    },
    {
        id: "age",
        label: "Age",
        placeholder: "Enter your age."
    },
    {
        id: "timezone",
        label: "Timezone",
        placeholder: "Enter your timezone."
    },
    {
        id: "membership",
        label: "How long have you been in SLRP?",
        placeholder: "Describe how long you have been a member of SLRP."
    },
    {
        id: "lawEnforcementExperience",
        label: "Previous Law Enforcement Experience",
        placeholder: "Describe your previous law enforcement experience."
    },
    {
        id: "departmentExperience",
        label: "Previous Department Experience",
        placeholder: "Describe your previous department experience."
    }
];

const policeQuestions = [

    {
        id: "police_1",
        label: "1. Traffic Stop",
        question:
            "You observe a civilian traveling significantly above the posted speed limit with no emergency reason.\n\n" +
            "What should you do?\n\n" +
            "A. Immediately ram their vehicle\n" +
            "B. Conduct a realistic traffic stop and handle the situation professionally\n" +
            "C. Arrest them immediately\n" +
            "D. Ignore the violation",
        placeholder: "Write your answer."
    },

    {
        id: "police_2",
        label: "2. Emergency Equipment",
        question:
            "When should police lights and sirens generally be used?\n\n" +
            "A. Whenever an officer wants traffic to move\n" +
            "B. During valid emergency responses or situations requiring them\n" +
            "C. To get through traffic faster while off duty\n" +
            "D. Constantly during patrol",
        placeholder: "Write your answer."
    },

    {
        id: "police_3",
        label: "3. Police Authority",
        question:
            "Which is the BEST example of professional police conduct?\n\n" +
            "A. Arresting someone because they insulted you\n" +
            "B. Using authority to win an argument\n" +
            "C. Following reasonable procedures and having a valid RP reason for enforcement actions\n" +
            "D. Using police equipment for entertainment",
        placeholder: "Write your answer."
    },

    {
        id: "police_4",
        label: "4. Pursuits",
        question:
            "During a vehicle pursuit, an officer should primarily consider:\n\n" +
            "A. Winning the pursuit at any cost\n" +
            "B. Realism, public safety, vehicle conditions, and the circumstances of the pursuit\n" +
            "C. How quickly they can end the chase\n" +
            "D. Whether their friends are watching",
        placeholder: "Write your answer."
    },

    {
        id: "police_5",
        label: "5. Evidence",
        question:
            "During an investigation, which is most appropriate?\n\n" +
            "A. Making assumptions without evidence\n" +
            "B. Gathering relevant information and evaluating evidence before reaching conclusions\n" +
            "C. Arresting everyone nearby\n" +
            "D. Asking another officer who they dislike",
        placeholder: "Write your answer."
    },

    {
        id: "police_6",
        label: "6. Police Abuse",
        question:
            "Officers may use their authority to punish civilians for personal disagreements.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "police_7",
        label: "7. Professionalism",
        question:
            "NYPD officers are expected to remain professional when dealing with civilians, suspects, and other departments.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "police_8",
        label: "8. VDM",
        question:
            "An officer intentionally using their patrol vehicle to run over a civilian without a legitimate RP reason is acceptable because they are police.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "police_9",
        label: "9. FRP",
        question:
            "Police officers are still required to follow realistic roleplay rules and may be punished for FRP.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "police_10",
        label: "10. Scene Management",
        question:
            "Officers should respect active emergency scenes and avoid unnecessarily interfering with other departments.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "police_11",
        label: "11. Why NYPD?",
        question:
            "Why do you want to join the NYPD, and what do you believe you can contribute to the department?",
        placeholder: "Write your complete response."
    },

    {
        id: "police_12",
        label: "12. Professional Policing",
        question:
            "What does professional behavior mean for an NYPD officer?",
        placeholder: "Write your complete response."
    },

    {
        id: "police_13",
        label: "13. Traffic Stops",
        question:
            "List four things an officer should consider when conducting a realistic traffic stop.",
        placeholder: "Write your complete response."
    },

    {
        id: "police_14",
        label: "14. Pursuits",
        question:
            "What makes a vehicle pursuit realistic rather than Fail Roleplay?",
        placeholder: "Write your complete response."
    },

    {
        id: "police_15",
        label: "15. Scene Safety",
        question:
            "Why is scene safety important when responding to an accident, crime, or emergency?",
        placeholder: "Write your complete response."
    },

    {
        id: "police_16",
        label: "16. Traffic Stop Scenario",
        question:
            "You stop a vehicle for excessive speeding.\n\n" +
            "The driver immediately becomes disrespectful and begins arguing with you.\n\n" +
            "How would you handle the situation without allowing their attitude to affect your professionalism or decision-making?",
        placeholder: "Write your complete response."
    },

    {
        id: "police_17",
        label: "17. Pursuit Scenario",
        question:
            "A suspect begins fleeing at extremely high speeds through a populated area.\n\n" +
            "Your patrol vehicle has already suffered significant damage.\n\n" +
            "Explain what you would consider before continuing the pursuit.",
        placeholder: "Write your complete response."
    },

    {
        id: "police_18",
        label: "18. Use of Authority",
        question:
            "A civilian insults you during an interaction but has not committed a crime or server rule violation.\n\n" +
            "What should you do?\n\n" +
            "A. Arrest them for disrespect\n" +
            "B. Threaten them with your authority\n" +
            "C. Remain professional and continue the interaction appropriately\n" +
            "D. Chase them\n\n" +
            "Explain your answer.",
        placeholder: "Write your complete response."
    },

    {
        id: "police_19",
        label: "19. Multi-Department Scene",
        question:
            "You arrive at a major vehicle accident. EMS and Fire Department personnel are already treating injured players.\n\n" +
            "How should you work with the other departments?",
        placeholder: "Write your complete response."
    },

    {
        id: "police_20",
        label: "20. Criminal Investigation",
        question:
            "You receive information that a player may have committed a crime, but you have no direct evidence.\n\n" +
            "What should you do before taking major enforcement action?",
        placeholder: "Write your complete response."
    },

    {
        id: "police_21",
        label: "21. Officer Misconduct",
        question:
            "You observe another officer intentionally using their patrol vehicle to ram civilians for entertainment.\n\n" +
            "What should you do?",
        placeholder: "Write your complete response."
    },

    {
        id: "police_22",
        label: "22. Dispatch",
        question:
            "Dispatch provides you with incomplete information about a potentially dangerous call.\n\n" +
            "What should you do before rushing into the situation?",
        placeholder: "Write your complete response."
    },

    {
        id: "police_23",
        label: "23. Active Scene",
        question:
            "You arrive at an active police scene where another officer is already handling the situation.\n\n" +
            "What should you do?\n\n" +
            "A. Immediately take control\n" +
            "B. Interrupt the officer\n" +
            "C. Assess the situation and assist appropriately without unnecessarily disrupting the scene\n" +
            "D. Leave because another officer is there",
        placeholder: "Write your answer."
    },

    {
        id: "police_24",
        label: "24. Complex Scenario",
        question:
            "You are on patrol when you observe a vehicle speeding.\n\n" +
            "You initiate a traffic stop.\n\n" +
            "The driver refuses to stop and begins fleeing.\n\n" +
            "During the pursuit:\n\n" +
            "• The suspect drives recklessly\n" +
            "• Your vehicle becomes damaged\n" +
            "• The pursuit enters a populated area\n" +
            "• Another officer joins\n" +
            "• Dispatch reports a possible crash ahead\n" +
            "• The suspect eventually stops\n\n" +
            "Explain, step-by-step, how you would handle this situation from the initial traffic stop through the end of the pursuit.\n\n" +
            "Your answer should demonstrate realism, communication, officer safety, public safety, pursuit judgment, and proper roleplay.",
        placeholder: "Write your complete response."
    },

    {
        id: "police_25",
        label: "25. Final Application Question",
        question:
            "In your own words, explain what makes a good NYPD officer in SLRP.\n\n" +
            "Your response should discuss:\n\n" +
            "• Professionalism\n" +
            "• Realistic policing\n" +
            "• Communication\n" +
            "• Traffic enforcement\n" +
            "• Pursuits\n" +
            "• Scene management\n" +
            "• Working with other departments\n" +
            "• Following SLRP rules\n" +
            "• Handling difficult civilians\n" +
            "• Accepting criticism and correction",
        placeholder: "Write your complete response."
    }

];


/*
====================================================
FIRE DEPARTMENT APPLICATION
====================================================
*/

const fireQuestions = [

    {
        id: "fire_1",
        label: "1. Structure Fire",
        question:
            "You arrive at a structure fire with visible smoke and several civilians outside.\n\n" +
            "What should you do FIRST?\n\n" +
            "A. Immediately enter without assessing conditions\n" +
            "B. Assess the scene, identify hazards, establish operations, and determine whether rescue is needed\n" +
            "C. Ignore the civilians\n" +
            "D. Wait for someone else to handle the scene",
        placeholder: "Write your answer."
    },

    {
        id: "fire_2",
        label: "2. Vehicle Extrication",
        question:
            "You arrive at a serious vehicle crash and discover a trapped occupant.\n\n" +
            "What is the BEST approach?\n\n" +
            "A. Pull the occupant out immediately\n" +
            "B. Assess the vehicle and hazards, coordinate the rescue, and work with EMS for patient care\n" +
            "C. Let civilians remove the person\n" +
            "D. Ignore the trapped occupant",
        placeholder: "Write your answer."
    },

    {
        id: "fire_3",
        label: "3. Medical Support",
        question:
            "EGFD arrives before EGEMT at a medical emergency.\n\n" +
            "What should EGFD personnel do?\n\n" +
            "A. Ignore the patient until EGEMT arrives\n" +
            "B. Provide appropriate emergency assistance within their training and coordinate with incoming EMS\n" +
            "C. Pretend to be a doctor\n" +
            "D. Immediately transport the patient regardless of circumstances",
        placeholder: "Write your answer."
    },

    {
        id: "fire_4",
        label: "4. Multiple Patients",
        question:
            "A major crash has several injured civilians.\n\n" +
            "What should be prioritized?\n\n" +
            "A. Treating friends first\n" +
            "B. Scene safety, patient assessment/triage, communication, and coordination with EMS\n" +
            "C. Moving everyone immediately\n" +
            "D. Ignoring less obvious injuries",
        placeholder: "Write your answer."
    },

    {
        id: "fire_5",
        label: "5. Department Cooperation",
        question:
            "At a major incident, NYPD, EGEMT, and NYSDOT are already present.\n\n" +
            "What should EGFD do?\n\n" +
            "A. Take control of every department\n" +
            "B. Coordinate with the other departments and perform appropriate fire/rescue duties\n" +
            "C. Ignore the other departments\n" +
            "D. Tell EGEMT how to treat patients",
        placeholder: "Write your answer."
    },

    {
        id: "fire_6",
        label: "6. Scene Safety",
        question:
            "Firefighters should consider hazards before entering an emergency scene.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "fire_7",
        label: "7. EMS Support",
        question:
            "EGFD members may assist with basic medical RP when appropriate, but should not claim medical abilities they have not been trained or assigned for.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "fire_8",
        label: "8. Realistic Roleplay",
        question:
            "EGFD members are still required to follow SLRP roleplay rules and may be disciplined for Fail Roleplay.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "fire_9",
        label: "9. Equipment",
        question:
            "Fire and medical equipment may be used for entertainment as long as no one complains.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "fire_10",
        label: "10. Teamwork",
        question:
            "EGFD should communicate and coordinate with EGEMT during incidents involving injured civilians.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "fire_11",
        label: "11. Why EGFD?",
        question:
            "Why do you want to join the East Greenbush Fire Department?",
        placeholder: "Write your complete response."
    },

    {
        id: "fire_12",
        label: "12. Fire & EMS",
        question:
            "Why is it important for firefighters to understand basic medical response during emergencies?",
        placeholder: "Write your complete response."
    },

    {
        id: "fire_13",
        label: "13. Scene Safety",
        question:
            "List four hazards firefighters or rescue personnel may need to consider at an emergency scene.",
        placeholder: "Write your complete response."
    },

    {
        id: "fire_14",
        label: "14. Patient Care",
        question:
            "What does professional patient care look like during medical RP?",
        placeholder: "Write your complete response."
    },

    {
        id: "fire_15",
        label: "15. Teamwork",
        question:
            "Why is communication between EGFD and EGEMT important during a rescue or medical emergency?",
        placeholder: "Write your complete response."
    },

    {
        id: "fire_16",
        label: "16. Vehicle Collision",
        question:
            "You arrive at a serious vehicle crash.\n\n" +
            "One person is trapped inside the vehicle, another person is walking around with an apparent injury, and traffic is still moving nearby.\n\n" +
            "Explain what you would do from arrival until EGEMT is able to take over patient care.",
        placeholder: "Write your complete response."
    },

    {
        id: "fire_17",
        label: "17. Structure Fire with Patients",
        question:
            "You arrive at a house fire.\n\n" +
            "Two civilians are outside. One appears to have smoke-related injuries, while another claims someone may still be inside.\n\n" +
            "Explain how you would handle the fire/rescue situation while coordinating medical care.",
        placeholder: "Write your complete response."
    },

    {
        id: "fire_18",
        label: "18. Medical Emergency",
        question:
            "EGFD is dispatched to a medical emergency and arrives before EGEMT.\n\n" +
            "What should you do while waiting for EGEMT?\n\n" +
            "A. Leave immediately\n" +
            "B. Assess the situation and provide appropriate assistance within your role while requesting/awaiting EMS\n" +
            "C. Declare yourself a paramedic regardless of training\n" +
            "D. Transport the patient yourself\n\n" +
            "Explain your answer.",
        placeholder: "Write your complete response."
    },

    {
        id: "fire_19",
        label: "19. Hazardous Material",
        question:
            "You arrive at a crash involving an unknown substance leaking from a vehicle.\n\n" +
            "A civilian wants to walk over and investigate.\n\n" +
            "What should you do?",
        placeholder: "Write your complete response."
    },

    {
        id: "fire_20",
        label: "20. Multiple Patients",
        question:
            "A vehicle collision produces five patients.\n\n" +
            "EGEMT has limited available personnel.\n\n" +
            "How would EGFD assist while ensuring patients are prioritized and EGEMT is kept informed?",
        placeholder: "Write your complete response."
    },

    {
        id: "fire_21",
        label: "21. Unsafe Fireground",
        question:
            "You are preparing to enter a structure when you notice conditions have suddenly become more dangerous.\n\n" +
            "What should you do?\n\n" +
            "A. Continue because you already committed\n" +
            "B. Ignore the danger\n" +
            "C. Communicate the hazard and follow appropriate safety procedures\n" +
            "D. Enter faster",
        placeholder: "Write your answer."
    },

    {
        id: "fire_22",
        label: "22. Patient Refusal",
        question:
            "You are assisting EGEMT with a patient who refuses assistance and becomes verbally aggressive.\n\n" +
            "How should you handle the situation?",
        placeholder: "Write your complete response."
    },

    {
        id: "fire_23",
        label: "23. Department Conflict",
        question:
            "During a major incident, an EGFD member and an EGEMT member disagree about how to handle a patient.\n\n" +
            "What should you do?",
        placeholder: "Write your complete response."
    },

    {
        id: "fire_24",
        label: "24. Major Incident",
        question:
            "You are dispatched to a serious highway collision.\n\n" +
            "When you arrive:\n\n" +
            "• Two vehicles are heavily damaged.\n" +
            "• One person is trapped.\n" +
            "• Three additional civilians are injured.\n" +
            "• Traffic is still moving near the crash.\n" +
            "• NYPD is establishing a perimeter.\n" +
            "• EGEMT is responding with limited personnel.\n" +
            "• NYSDOT is preparing to close lanes.\n" +
            "• One vehicle appears to be leaking an unknown substance.\n" +
            "• Additional emergency units are arriving.\n\n" +
            "Explain step-by-step how you would handle the incident.\n\n" +
            "Your answer should demonstrate:\n" +
            "• Scene safety\n" +
            "• Fire/rescue operations\n" +
            "• Vehicle extrication\n" +
            "• Basic medical awareness\n" +
            "• Patient prioritization\n" +
            "• Communication\n" +
            "• Department cooperation\n" +
            "• Proper equipment use\n" +
            "• Realistic RP\n" +
            "• Professionalism",
        placeholder: "Write your complete response."
    },

    {
        id: "fire_25",
        label: "25. What Makes a Good EGFD Member?",
        question:
            "In your own words, explain what makes someone a good East Greenbush Fire Department member in SLRP.\n\n" +
            "Your answer should discuss:\n\n" +
            "• Fire response\n" +
            "• Rescue operations\n" +
            "• Vehicle extrication\n" +
            "• Scene safety\n" +
            "• Basic medical awareness\n" +
            "• Patient assistance\n" +
            "• Communication\n" +
            "• Teamwork\n" +
            "• Working with EGEMT\n" +
            "• Working with NYPD\n" +
            "• Working with NYSDOT\n" +
            "• Realistic roleplay\n" +
            "• Professionalism\n" +
            "• Following SLRP rules\n" +
            "• Working under pressure\n\n" +
            "Your response should demonstrate that you understand the difference between fire/rescue responsibilities and EMS responsibilities, while explaining how the two departments should work together.",
        placeholder: "Write your complete response."
    }

];


/*
====================================================
EMS APPLICATION
====================================================
*/

const egemtQuestions = [

    {
        id: "egemt_1",
        label: "1. Scene Safety",
        question:
            "You arrive at a vehicle accident and notice traffic is still moving quickly around the crash.\n\n" +
            "What should you do FIRST?\n\n" +
            "A. Immediately run to the patient\n" +
            "B. Assess the scene and ensure it is reasonably safe before beginning patient care\n" +
            "C. Ignore traffic\n" +
            "D. Leave the scene",
        placeholder: "Write your answer."
    },

    {
        id: "egemt_2",
        label: "2. Patient Priority",
        question:
            "You arrive at a major accident with multiple injured civilians.\n\n" +
            "What should you prioritize?\n\n" +
            "A. Treat whoever arrived first\n" +
            "B. Triage and prioritize patients based on the severity of their injuries\n" +
            "C. Treat your friend first\n" +
            "D. Wait until NYPD tells you who to treat",
        placeholder: "Write your answer."
    },

    {
        id: "egemt_3",
        label: "3. EMS Communication",
        question:
            "Why is communication important during an emergency?\n\n" +
            "A. It is not important\n" +
            "B. It allows departments to coordinate resources, maintain scene safety, and provide effective patient care\n" +
            "C. Only police need communication\n" +
            "D. It is only necessary after the incident",
        placeholder: "Write your answer."
    },

    {
        id: "egemt_4",
        label: "4. Multi-Department Response",
        question:
            "NYPD, FD, and NYSDOT are already at a major crash.\n\n" +
            "What should EGEMT do?\n\n" +
            "A. Take control of every department\n" +
            "B. Coordinate with the other responders and focus on patient care and medical needs\n" +
            "C. Ignore the other departments\n" +
            "D. Leave because other departments are present",
        placeholder: "Write your answer."
    },

    {
        id: "egemt_5",
        label: "5. EMS Equipment",
        question:
            "Which is the most appropriate use of EGEMT equipment?\n\n" +
            "A. Using equipment for entertainment\n" +
            "B. Using medical equipment during legitimate emergency RP\n" +
            "C. Using equipment to gain advantages over civilians\n" +
            "D. Using equipment whenever you are bored",
        placeholder: "Write your answer."
    },

    {
        id: "egemt_6",
        label: "6. Scene Safety",
        question:
            "EMS personnel should consider scene safety before entering a dangerous situation.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "egemt_7",
        label: "7. Realistic Medical RP",
        question:
            "EGEMT members are required to follow SLRP roleplay rules and may be disciplined for Fail Roleplay.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "egemt_8",
        label: "8. Medical Equipment",
        question:
            "Medical equipment should only be used for legitimate medical or roleplay purposes.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "egemt_9",
        label: "9. Patient Care",
        question:
            "EMS personnel should provide the same level of professionalism to every patient, regardless of whether they personally know them.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "egemt_10",
        label: "10. Department Authority",
        question:
            "EGEMT members automatically have authority over NYPD, FD, and NYSDOT during every emergency.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "egemt_11",
        label: "11. Why EGEMT?",
        question:
            "Why do you want to join East Greenbush Emergency Medical Team?\n\n" +
            "What do you believe you can contribute?",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_12",
        label: "12. Patient Care",
        question:
            "What does providing professional patient care mean in SLRP?",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_13",
        label: "13. Scene Safety",
        question:
            "List four things you should consider before providing care at an emergency scene.",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_14",
        label: "14. Communication",
        question:
            "Why is communication between EGEMT and other departments important during emergencies?",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_15",
        label: "15. Professionalism",
        question:
            "What does being a professional EGEMT member mean to you?",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_16",
        label: "16. Vehicle Accident",
        question:
            "You arrive at a major vehicle accident.\n\n" +
            "Traffic is still moving around the crash, one vehicle appears unstable, and several civilians are standing nearby.\n\n" +
            "Explain what you would do before beginning patient treatment.",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_17",
        label: "17. Multiple Patients",
        question:
            "You arrive at an accident involving four patients.\n\n" +
            "One patient is walking around, two are injured but conscious, and one appears to have a severe injury.\n\n" +
            "How would you prioritize your response?",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_18",
        label: "18. Patient Refusal",
        question:
            "A conscious patient refuses medical treatment even though you believe they should be evaluated.\n\n" +
            "How would you handle the situation professionally?",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_19",
        label: "19. Multi-Department Scene",
        question:
            "EGEMT arrives at a major crash.\n\n" +
            "NYPD is controlling the scene, FD is handling a vehicle hazard, and NYSDOT is preparing to close lanes.\n\n" +
            "How should EGEMT communicate and work with the other departments?",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_20",
        label: "20. Difficult Patient",
        question:
            "A patient becomes angry and begins yelling at you while you are attempting to provide care.\n\n" +
            "What would you do?",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_21",
        label: "21. Scene Becomes Unsafe",
        question:
            "You are treating a patient when the scene suddenly becomes dangerous.\n\n" +
            "What should you do?\n\n" +
            "A. Continue treating the patient no matter what\n" +
            "B. Ignore the danger\n" +
            "C. Prioritize scene safety, communicate with other responders, and move to safety when appropriate\n" +
            "D. Leave without telling anyone\n\n" +
            "Explain your answer.",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_22",
        label: "22. Dispatch Information",
        question:
            "Dispatch provides limited information about an emergency.\n\n" +
            "What should you do while responding and after arriving?",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_23",
        label: "23. Major Incident",
        question:
            "A large incident produces multiple patients and limited EMS resources.\n\n" +
            "Explain how you would communicate with your team and prioritize available resources.",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_24",
        label: "24. Complex EMS Scenario",
        question:
            "You are dispatched to a major highway accident.\n\n" +
            "When you arrive:\n\n" +
            "• Multiple vehicles are involved.\n" +
            "• Several civilians are injured.\n" +
            "• One patient is unconscious.\n" +
            "• Traffic is still moving near the scene.\n" +
            "• NYPD is establishing a perimeter.\n" +
            "• FD is working to secure a damaged vehicle.\n" +
            "• NYSDOT is preparing traffic control.\n" +
            "• Additional patients are being discovered.\n" +
            "• Your available EMS resources are limited.\n\n" +
            "Explain step-by-step how you would handle the scene.\n\n" +
            "Your answer should demonstrate:\n" +
            "• Scene safety\n" +
            "• Patient prioritization\n" +
            "• Triage\n" +
            "• Communication\n" +
            "• Medical RP\n" +
            "• Department cooperation\n" +
            "• Resource management\n" +
            "• Professionalism",
        placeholder: "Write your complete response."
    },

    {
        id: "egemt_25",
        label: "25. What Makes a Good EGEMT Member?",
        question:
            "In your own words, explain what makes someone a good EGEMT member in SLRP.\n\n" +
            "Your response should discuss:\n\n" +
            "• Patient care\n" +
            "• Scene safety\n" +
            "• Triage\n" +
            "• Communication\n" +
            "• Teamwork\n" +
            "• Emergency response\n" +
            "• Working with NYPD, FD, and NYSDOT\n" +
            "• Realistic medical RP\n" +
            "• Professionalism\n" +
            "• Following SLRP rules\n" +
            "• Handling difficult patients\n" +
            "• Accepting criticism\n" +
            "• Working under pressure\n\n" +
            "Your response should demonstrate your understanding of the responsibility you are applying for.",
        placeholder: "Write your complete response."
    }

];

/*
====================================================
DOT APPLICATION
====================================================
*/

const dotQuestions = [

    {
        id: "dot_1",
        label: "1. Roadway Hazard",
        question:
            "You are patrolling when you discover a large object blocking multiple lanes of traffic.\n\n" +
            "What should you do FIRST?\n\n" +
            "A. Drive around it and continue your patrol\n" +
            "B. Immediately remove it without considering traffic\n" +
            "C. Assess the hazard, protect the area, and establish appropriate traffic control\n" +
            "D. Tell civilians to remove it themselves",
        placeholder: "Write your answer."
    },

    {
        id: "dot_2",
        label: "2. Work Zone Safety",
        question:
            "What is the PRIMARY purpose of traffic control around an NYSDOT work zone?\n\n" +
            "A. Make traffic inconvenient\n" +
            "B. Protect workers, civilians, and responding personnel while maintaining safe traffic flow\n" +
            "C. Give NYSDOT authority over police\n" +
            "D. Prevent anyone from using the road",
        placeholder: "Write your answer."
    },

    {
        id: "dot_3",
        label: "3. Department Cooperation",
        question:
            "You arrive at a major crash and NYPD, FD, and EMS are already working.\n\n" +
            "What should NYSDOT primarily focus on?\n\n" +
            "A. Taking control of the entire scene\n" +
            "B. Conducting the criminal investigation\n" +
            "C. Roadway hazards, traffic control, and transportation-related assistance\n" +
            "D. Telling EMS how to treat the patient",
        placeholder: "Write your answer."
    },

    {
        id: "dot_4",
        label: "4. Road Closure",
        question:
            "Which situation provides the BEST reason for an NYSDOT road closure?\n\n" +
            "A. An employee wants fewer cars around\n" +
            "B. Construction, roadway damage, a major hazard, or an emergency makes the roadway unsafe\n" +
            "C. An employee wants to test equipment\n" +
            "D. A civilian is annoying the employee",
        placeholder: "Write your answer."
    },

    {
        id: "dot_5",
        label: "5. Equipment",
        question:
            "Which is the most appropriate use of NYSDOT equipment?\n\n" +
            "A. Using it to drive recklessly for entertainment\n" +
            "B. Using it to perform legitimate transportation, maintenance, construction, or emergency duties\n" +
            "C. Using it to chase civilians\n" +
            "D. Using it to gain an advantage during RP",
        placeholder: "Write your answer."
    },

    {
        id: "dot_6",
        label: "6. Realistic Roleplay",
        question:
            "NYSDOT employees are required to follow SLRP roleplay rules and can be disciplined for Fail Roleplay.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "dot_7",
        label: "7. Emergency Equipment",
        question:
            "Emergency lights and other department equipment should only be used when there is a legitimate RP reason.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "dot_8",
        label: "8. Unauthorized Road Closures",
        question:
            "An NYSDOT employee may close any road whenever they want, even without construction, maintenance, hazards, or another legitimate reason.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "dot_9",
        label: "9. Department Authority",
        question:
            "Being an NYSDOT employee automatically gives you authority to override NYPD, FD, EMS, or other departments.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "dot_10",
        label: "10. Worker Safety",
        question:
            "Protecting workers and civilians should be a priority when establishing or managing a work zone.\n\n" +
            "True / False",
        placeholder: "True or False?"
    },

    {
        id: "dot_11",
        label: "11. Why NYSDOT?",
        question:
            "Why do you want to join the New York State Department of Transportation?\n\n" +
            "What do you believe you could contribute to the department?",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_12",
        label: "12. Road Safety",
        question:
            "What does roadway safety mean to you in SLRP?",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_13",
        label: "13. Work Zone",
        question:
            "List at least four things you should consider when establishing a work zone.",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_14",
        label: "14. Department Communication",
        question:
            "Why is communication important when NYSDOT is working alongside NYPD, FD, EMS, or other departments?",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_15",
        label: "15. Professionalism",
        question:
            "What does being a professional NYSDOT employee mean to you?",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_16",
        label: "16. Major Roadway Obstruction",
        question:
            "You arrive at a highway where a large object is blocking two lanes.\n\n" +
            "Vehicles are still traveling through the area at high speeds, and several drivers are nearly crashing.\n\n" +
            "Explain what you would do from the moment you arrive until the roadway is safe.",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_17",
        label: "17. Construction Work Zone",
        question:
            "You are working on a construction project.\n\n" +
            "Signs and traffic controls have been placed, but several civilians repeatedly drive through the work zone and ignore instructions.\n\n" +
            "How would you handle the situation while remaining professional?",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_18",
        label: "18. Major Accident",
        question:
            "NYSDOT arrives at a major vehicle accident.\n\n" +
            "NYPD is investigating, FD is handling vehicle hazards, and EMS is treating injured civilians.\n\n" +
            "What should NYSDOT do?\n\n" +
            "A. Take control of the entire scene\n" +
            "B. Focus on roadway safety, traffic control, and transportation-related assistance\n" +
            "C. Begin arresting people\n" +
            "D. Tell EMS how to treat patients\n\n" +
            "Explain your answer.",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_19",
        label: "19. Damaged Roadway",
        question:
            "You discover a section of roadway that is severely damaged and could cause a vehicle to crash.\n\n" +
            "Explain what you would do to protect civilians and notify the appropriate personnel.",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_20",
        label: "20. Traffic Backup",
        question:
            "A construction project creates a major traffic backup.\n\n" +
            "Drivers become impatient and begin ignoring traffic controls.\n\n" +
            "How would you manage the situation?",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_21",
        label: "21. Employee Misconduct",
        question:
            "You witness another NYSDOT employee using department equipment to intentionally ram civilian vehicles for entertainment.\n\n" +
            "What should you do?",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_22",
        label: "22. NYPD Request",
        question:
            "NYPD requests NYSDOT assistance with closing a roadway during an active incident.\n\n" +
            "What information should you determine before establishing the closure?",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_23",
        label: "23. Work Zone Crash",
        question:
            "A civilian crashes into an NYSDOT work zone.\n\n" +
            "No workers appear injured, but department equipment is damaged and traffic is becoming dangerous.\n\n" +
            "Explain your response and identify which departments you may need to contact.",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_24",
        label: "24. Major Transportation Incident",
        question:
            "You are dispatched to a major highway incident.\n\n" +
            "When you arrive:\n\n" +
            "• Two lanes are blocked.\n" +
            "• Traffic is backing up rapidly.\n" +
            "• NYPD is responding to the original incident.\n" +
            "• FD is handling a vehicle hazard.\n" +
            "• EMS is treating an injured civilian.\n" +
            "• NYSDOT equipment is required to clear the roadway.\n" +
            "• Several civilians are ignoring temporary traffic controls.\n" +
            "• Additional traffic is approaching the scene.\n\n" +
            "Explain step-by-step how you would handle the situation.\n\n" +
            "Your response should demonstrate:\n" +
            "• Roadway safety\n" +
            "• Traffic control\n" +
            "• Work-zone management\n" +
            "• Communication\n" +
            "• Department cooperation\n" +
            "• Proper equipment usage\n" +
            "• Realistic roleplay\n" +
            "• Professionalism",
        placeholder: "Write your complete response."
    },

    {
        id: "dot_25",
        label: "25. What Makes a Good NYSDOT Employee?",
        question:
            "In your own words, explain what makes someone a good NYSDOT employee in SLRP.\n\n" +
            "Your answer should discuss:\n\n" +
            "• Road safety\n" +
            "• Construction and maintenance\n" +
            "• Traffic control\n" +
            "• Work zones\n" +
            "• Communication\n" +
            "• Emergency situations\n" +
            "• Working with NYPD, FD, and EMS\n" +
            "• Realistic roleplay\n" +
            "• Professionalism\n" +
            "• Following SLRP rules\n" +
            "• Handling difficult civilians\n" +
            "• Accepting criticism\n" +
            "• Working as a team\n\n" +
            "Your response should be detailed and demonstrate your understanding of the responsibility you are applying for.",
        placeholder: "Write your complete response."
    }

];


/*
====================================================
EXPORT APPLICATIONS
====================================================
*/

module.exports = {

    staff: {
        name: "Staff & Moderator",
        emoji: "🛡️",
        color: "#5865F2",
        information: personalInformation,
        questions: staffQuestions
    },

    fire: {
        name: "Fire Department",
        emoji: "🔥",
        color: "#ED4245",
        information: personalInformation,
        questions: fireQuestions
    },

    ems: {
        name: "EMS Department",
        emoji: "🚑",
        color: "#57F287",
        information: personalInformation,
        questions: egemtQuestions
    },

    dot: {
        name: "DOT Department",
        emoji: "🚧",
        color: "#FEE75C",
        information: personalInformation,
        questions: dotQuestions
    },

    police: {
        name: "Police Department",
        emoji: "🚓",
        color: "#5865F2",
        information: policeInformation,
        questions: policeQuestions
    }

};