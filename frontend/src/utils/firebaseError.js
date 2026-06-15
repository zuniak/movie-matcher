const MESSAGES = {
  'auth/invalid-credential': 'Nieprawidłowy email lub hasło.',
  'auth/user-not-found': 'Nie znaleziono konta o podanym adresie email.',
  'auth/wrong-password': 'Nieprawidłowe hasło.',
  'auth/email-already-in-use': 'Ten adres email jest już zajęty.',
  'auth/weak-password': 'Hasło jest zbyt słabe — musi mieć min. 6 znaków.',
  'auth/invalid-email': 'Nieprawidłowy format adresu email.',
  'auth/too-many-requests': 'Zbyt wiele prób logowania. Spróbuj ponownie za chwilę.',
  'auth/network-request-failed': 'Brak połączenia z internetem. Sprawdź sieć.',
  'auth/user-disabled': 'To konto zostało zablokowane.',
}

export function getAuthError(err) {
  return MESSAGES[err?.code] ?? 'Coś poszło nie tak. Spróbuj ponownie.'
}
