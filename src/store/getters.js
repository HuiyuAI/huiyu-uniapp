export default {
	token: state => state.app.token,
	userInfo: state => state.app.userInfo || {},
	uid: state => state.app.uid,
	appConfig: state => state.app.appConfig || {},
	data_dir: state => state.app.appCommon?.data_dir.replace(/\\/g,'/') || '',
};
