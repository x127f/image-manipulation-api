const canvacord = require("canvacord");
const img = "https://cdn.discordapp.com/embed/avatars/0.png";

async function main() {
	console.time("generate");
	const rank = new canvacord.Rank()
		.setAvatar(img)
		.setCurrentXP(50)
		.setRequiredXP(100)
		.setStatus("dnd")
		.setProgressBar("#FFFFFF", "COLOR")
		.setUsername("Snowflake")
		.setDiscriminator("0007");

	await rank.build();
	console.timeEnd("generate");
	main();
}

main();
