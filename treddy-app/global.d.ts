interface Window {
  MercadoPago: new (
    publicKey: string,
    options: { locale: string }
  ) => {
    checkout: (options: { preference: { id: string }; autoOpen: boolean }) => void;
  };
}
