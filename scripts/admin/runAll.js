const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

async function runScript(scriptName) {
  console.log(`\n========== Ejecutando ${scriptName} ==========\n`);
  try {
    const { stdout, stderr } = await execPromise(`node scripts/admin/${scriptName}.js`);
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(`Error al ejecutar ${scriptName}:`, error);
  }
}

async function runAdminTests() {
  // Primero creamos un administrador
  await runScript("createAdmin");
  
  // Luego ejecutamos las pruebas de administrador
  const adminScripts = [
    "login",
    "getAllUsers",
    "getAllTasks",
    "updateUser"
    // No incluimos deleteUser y manageTasks porque requieren interacci�n
  ];
  
  // Espera 2 segundos entre cada script
  for (const script of adminScripts) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await runScript(script);
  }
  
  console.log("\n========== Pruebas de administrador completadas ==========\n");
  console.log("Para probar funciones interactivas, ejecuta estos scripts individualmente:");
  console.log("- node scripts/admin/deleteUser.js");
  console.log("- node scripts/admin/manageTasks.js");
}

runAdminTests();
