import { AuthContextProvider } from './authContext.jsx';

const composeProviders =
  (...providers) =>
  ({ children }) => {
    return providers.reduceRight(
      (child, Provider) => <Provider>{child}</Provider>,
      children
    );
  };

const Providers = composeProviders(
  AuthContextProvider
);

export default Providers;