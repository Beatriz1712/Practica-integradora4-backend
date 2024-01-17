import 'dotenv/config'
import app from './app.js';
import chalk from 'chalk';
// Inicia la aplicación
//**** UP SERVER  */
const PORT = 8080;
app.listen(PORT, () => {
  console.log(chalk.bgYellowBright.black.bold(`SERVER UP PORT: ${PORT}`));
});