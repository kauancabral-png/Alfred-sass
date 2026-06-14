const axios = require('axios');

const users = [
  { name: 'Alfredo gutierrez', email: 'alfredogutierrez@netbca.com' },
  { name: 'Adalina Baez', email: 'adalina.baez@gmail.com' },
  { name: 'Marcelo Abel González Ortiz', email: 'marcelogonza519@gmail.com' },
  { name: 'Haide Giselle Cruz Miranda', email: 'aydgismi@gmail.com' },
  { name: 'Claudia Lucila Iriarte de Antonelli', email: 'claudiadeantonelli6@gmail.com' },
  { name: 'Roberto cavalie', email: 'grupocafersac@gmail.com' },
  { name: 'Allan Legaspi Sauter', email: 'lsallan999@gmail.com' },
  { name: 'Lourdes Gimenez', email: 'lourdesdecardoso24@gmail.com' },
  { name: 'Ernesto Palencia', email: 'drernestopalencia@gmail.com' },
  { name: 'Jorge Martinez', email: 'jmartineztijerino@gmail.com' },
  { name: 'GUILLERMO SAMAYOA', email: 'gsamayoa@gmail.com' },
  { name: 'Kauan Admin', email: 'kauankun114@gmail.com' }
];

async function registerAll() {
  for (const user of users) {
    try {
      const res = await axios.post('https://alfred-backend-8t7n.onrender.com/api/auth/register', {
        name: user.name,
        email: user.email.toLowerCase().trim(),
        password: 'alfred123'
      });
      console.log(`Success: ${user.email}`);
    } catch (e) {
      console.error(`Failed ${user.email}: ${e.response?.data?.message || e.message}`);
    }
  }
}

registerAll();
