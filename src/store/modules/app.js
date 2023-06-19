const state = {
	token: uni.getStorageSync("huiyu_token") || null,
	userInfo: uni.getStorageSync("huiyu_user_info") || null,
	uid: uni.getStorageSync("huiyu_uid") || null,
	appConfig: uni.getStorageSync("huiyu_app_config_dict") || null,
};

const mutations = {

};

const actions = {
};

export default {
	state,
	mutations,
	actions
};
