import ky, { type Options } from "ky";

export const api = {
  // TResponse is a placeholder that will be replaced with the actual response type. Make it more reusable.
  // So whoever is using the api.get() or api.post(), they can pass in the type they want.
  get: <TResponse>(url: string, opts?: Options) =>
    ky.get(url, opts).json<TResponse>(),
  post: <TResponse>(url: string, opts?: Options) =>
    ky.post(url, opts).json<TResponse>(), // expects the result of parsinf of type TResponse.
};
