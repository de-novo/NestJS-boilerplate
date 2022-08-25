import { configScheme } from '../scheme/config.scheme';

export const configOption = {
  envFilePath:
    process.env.NODE_ENV !== 'production'
      ? `.${process.env.NODE_ENV}.env`
      : `.env`,
  validationSchema: configScheme,
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  isGlobal: true,
};
