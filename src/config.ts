import colors from 'colors';

const reqEnvVars = ['MONGODB_URI', 'EMAIL', 'EMAIL_PASSWORD'];

export function check(): void {
  const unsetEnv = reqEnvVars.filter((eVar) => process.env[eVar] === undefined);
  if (unsetEnv.length > 0) {
    const errMsg = colors.red(
      `Required env variables are not set: [${colors.yellow(
        unsetEnv.join(', '.red),
      )}]`,
    );
    throw new Error(errMsg);
  }
  console.info(colors.green(`Configuration OKAY!`));
}
