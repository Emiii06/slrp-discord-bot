const {
    STAFF_ROLES,
    ADMIN_ROLES
} = require("../config");

function isStaff(member) {
    return member.roles.cache.some(role =>
        STAFF_ROLES.includes(role.id)
    );
}

function isAdmin(member) {
    return member.roles.cache.some(role =>
        ADMIN_ROLES.includes(role.id)
    );
}

module.exports = {
    isStaff,
    isAdmin
};