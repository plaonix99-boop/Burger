import ReflectionHelper from "./reflection";

export default class SessionHelper {
	constructor(session) {
		this.session = session;
		this.sessionHelper = new ReflectionHelper(session);
	}

	getSessionId() {
		return this.session.func_111286_b();
	}

	getPlayerId() { // uuid without dashes
		return this.session.func_148255_b();
	}

	setPlayerId(playerId) {
		this.sessionHelper.setField("field_148257_b", playerId);
	}

	getUsername() {
		return this.session.func_111285_a();
	}

	setUsername(username) {
		this.sessionHelper.setField("field_74286_b", username);
	}

	getToken() {
		return this.session.func_148254_d();
	}

	setToken(token) {
		this.sessionHelper.setField("field_148258_c", token);
	}
}
