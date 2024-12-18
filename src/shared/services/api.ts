import { getLocales } from "expo-localization";
import analytics from "./analytics";

const API_URL = "";

export const apiService = {
  analyzeFoodImage: async (image: string) => {
    try {
      const formdata = new FormData();
      const language = getLocales()[0].languageTag;

      const fileName = image.split("/").pop();
      const fileType = fileName?.split(".").pop();

      formdata.append("image", {
        uri: image,
        name: fileName,
        type: fileType ? `image/${fileType}` : "application/octet-stream",
      } as any);

      formdata.append("language", language ?? "en-US");

      const requestOptions = {
        method: "POST",
        body: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await fetch(
        `${API_URL}/analyze-food-via-image`,
        requestOptions,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return result;
    } catch (e) {
      analytics.track("error", {
        message: "Error in analyzeFoodImage",
        error: e ?? "Unknown error",
      });
      throw e;
    }
  },
  analyzeFoodDescription: async (description: string) => {
    try {
      const language = getLocales()[0].languageTag;

      const body = JSON.stringify({
        description,
        language: language ?? "en-US",
      });

      const requestOptions = {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `${API_URL}/analyze-food-via-description`,
        requestOptions,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return result;
    } catch (e) {
      analytics.track("error", {
        message: "Error in analyzeFoodDescription",
        error: e ?? "Unknown error",
      });
      throw e;
    }
  },
  fetchFlags: async () => {
    try {
      const response = await fetch(`${API_URL}/flags`);
      return response.json();
    } catch (e) {
      analytics.track("error", {
        message: "Error in fetchFlags",
        error: e ?? "Unknown error",
      });
      throw e;
    }
  },
};
