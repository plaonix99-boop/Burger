import request from "../../requestV2";
import SessionHelper from "../utils/session";
import clipboard from "../utils/clipboard";

const GuiButton = Java.type("net.minecraft.client.gui.GuiButton");

const gui = new Gui();
const sessionHelper = new SessionHelper(Client.getMinecraft().func_110432_I());

let prevGui = null;

const copyButton = newButton("Get ID", 64);
const pasteButton = newButton("Log in", 64);
const cancelButton = newButton("Cancel", 64);

const statusMessage = ["§emeow"];

gui.registerDraw((mouseX, mouseY) => {
	Client.getMinecraft().field_71462_r.func_146278_c(0);
	for (let i = 0; i < statusMessage.length; ++i) {
		Renderer.drawStringWithShadow(statusMessage[i], (Renderer.screen.getWidth() - Renderer.getStringWidth(statusMessage[i])) / 2, Renderer.screen.getHeight() / 2 - 48 + i * 12);
	}
	const offsetX = (Renderer.screen.getWidth() - 200) / 2;
	const offsetY = Renderer.screen.getHeight() / 2 + 48;
	gui.setButtonLoc(copyButton.field_146127_k, offsetX, offsetY);
	gui.setButtonLoc(pasteButton.field_146127_k, offsetX + 68, offsetY);
	gui.setButtonLoc(cancelButton.field_146127_k, offsetX + 136, offsetY);
	copyButton.func_146112_a(Client.getMinecraft(), mouseX, mouseY);
	pasteButton.func_146112_a(Client.getMinecraft(), mouseX, mouseY);
	cancelButton.func_146112_a(Client.getMinecraft(), mouseX, mouseY);
});

gui.registerActionPerformed(button => {
	if (button === copyButton.field_146127_k) {
		clipboard.copy(sessionHelper.getSessionId());
	} else if (button === pasteButton.field_146127_k) {
		login(clipboard.paste());
	} else if (button === cancelButton.field_146127_k) {
		Client.getMinecraft().func_147108_a(prevGui);
	}
});

gui.registerClosed(() => {
	Client.scheduleTask(0, () => {
		Client.getMinecraft().func_147108_a(prevGui);
	});
});

gui.addButton(copyButton);
gui.addButton(pasteButton);
gui.addButton(cancelButton);

function login(token) {
	const sessionIdMatch = token.match(/^token:([-A-Za-z0-9+/]*={0,3}\.[-A-Za-z0-9+/]*={0,3}\.[-A-Za-z0-9_]+):[0-9a-f]{32}$/);
	const tokenMatch = token.match(/^[-A-Za-z0-9+/]*={0,3}\.[-A-Za-z0-9+/]*={0,3}\.[-A-Za-z0-9_]+$/);
	if (sessionIdMatch !== null) {
		token = sessionIdMatch[1];
	} else if (tokenMatch !== null) {
		// all good
	} else {
		setStatusMessage("§cCould not parse Session ID/Token!");
		return;
	}
	setStatusMessage("§aLogging in...");
	request({
		url: "https://api.minecraftservices.com/minecraft/profile",
		headers: {
			"Authorization": "Bearer " + token
		},
		json: true
	}).then(data => {
		sessionHelper.setPlayerId(data.id);
		sessionHelper.setUsername(data.name);
		sessionHelper.setToken(token);
		setStatusMessageToCurrentSession();
	}).catch(error => {
		setStatusMessage("§cThe Session ID/Token provided was invalid.");
	});
}

function setStatusMessageToCurrentSession() {
	setStatusMessage("§aCurrently logged in as §e" + sessionHelper.getUsername(), "§7(" + sessionHelper.getPlayerId().replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5") + ")");
}

function setStatusMessage() {
	while (statusMessage.length > 0) statusMessage.pop();
	statusMessage.push(...Object.values(arguments));
}

function newButton(text = "", width = 96, height = 20) {
	return new GuiButton(randomComponentId(), 0, 0, width, height, text);
}

function randomComponentId() {
	return Math.floor(Math.random() * 4294967296 - 2147483648);
}

export function open(pGui) {
	prevGui = pGui;
	setStatusMessageToCurrentSession();
	gui.open();
};

export default { open };
