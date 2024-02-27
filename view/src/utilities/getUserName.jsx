export const getUserName = () => {
    const systemUser = window.sessionStorage.getItem('userInfo');
    if (systemUser) {
        const parseSystemUser = JSON.parse(systemUser);
        const systemUserName = parseSystemUser.userName;
        if (systemUserName) {
            return systemUserName;
        } else {
            return 'Unknown';
        }
    }
}