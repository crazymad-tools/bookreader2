const electronInstaller = require("electron-winstaller");

async function main() {
  try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: ".",
      outputDirectory: "./output",
      authors: "crazy-mad",
      exe: "bookreader.exe"
    });
    console.log("It worked!");
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }
}

main();