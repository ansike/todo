import qs from "qs";

export const request = function request<T>(
  url: string,
  config: Record<string, any> = {}
) {
  if (typeof url !== "string")
    throw new TypeError(` ${url} is not an string! `);

  const { method = "GET", data } = config;

  // 区分get请求和post请求传递参数
  delete config.data;
  if (method.toUpperCase() === "POST") {
    config.body = qs.stringify(data);
  } else {
    const query = new URLSearchParams(data).toString();
    url = `${url}${query ? "?" + query : ""}`;
  }

  return new Promise<T>((resolve, reject) => {
    fetch(url, config)
      .then(async (res) => {
        console.log();

        const response = res.headers
          .get("content-type")
          ?.toLocaleLowerCase()
          .includes("application/json")
          ? await res.json()
          : await res.text();
        resolve(response);
      })
      .catch(reject);
  });
};
