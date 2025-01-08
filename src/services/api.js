import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7250/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error messages mapping
export const HttpResponses = {
  msg1: "Sunt deja examene programate in acea perioada",
  msg2: "Timpul de începere nu este în format corect",
  msg3: "Profesorul participa deja la un alt examen",
  msg4: "Asistentul participa deja la un alt examen",
  msg5: "Examen adaugat",
  msg6: "Cerere deja aprobata sau respinsa",
  msg7: "Deja este un examen programat pentru acea cerere",
  msg8: "Examenele sunt prea aproape una, modifica data",
  msg9: "Sunt deja examene programate in acea perioada",
  msg10: "Exista deja un examen programat pentru aceasta disciplina",
  msg11: "Cerere trimisa",
  msg12: "Email invalid",
  msg13: "Parola invalida",
  msg14: "Rolul utilizatorul nu a fost gasit",
  msg15: "Locatie adaugata",
  msg16: "Subiect adaugat",
  msg17: "Parola este prea slaba, minim 5 caractere",
  msg18: "Utilizator adaugat",
  msg19: "Exista deja o cerere în procesare"
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Handle specific error messages based on response
      if (status === 400) {
        // Map specific error messages from backend to frontend messages
        const errorMessage = data.message || data;
        throw new Error(errorMessage);
      }

      if (status === 401) {
        // Handle unauthorized access
        throw new Error(HttpResponses.msg13);
      }

      if (status === 404) {
        // Handle not found
        throw new Error(HttpResponses.msg14);
      }
    }

    // Network errors or other issues
    throw new Error('A apărut o eroare în comunicarea cu serverul');
  }
);

export default api;
