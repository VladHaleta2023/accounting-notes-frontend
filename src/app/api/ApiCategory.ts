import { IApiResponse } from "@/app/interfaces/IApiResponse";
import { TypeCategory } from "@/app/types/TypeCategory";
import api from "@/app/utils/api";
import showAlert from "@/app/utils/alert";
import { AxiosError } from "axios";

export type ResponseCategories = IApiResponse<TypeCategory[]>;

export class ApiCategory {
    constructor() {}

    private static handleError(error: unknown): void {
        const err = error as AxiosError<{ message?: string | string[] }>;
        const status = err.response?.status || 500;
        const message = Array.isArray(err.response?.data?.message)
            ? err.response?.data?.message[0]
            : err.response?.data?.message || "Unknown error";

        showAlert(status, message);
    }

    private static async request<T>(
        method: "get" | "post" | "put" | "delete",
        url: string,
        data?: unknown
    ): Promise<T | null> {
        try {
            let res;

            switch (method) {
                case "get":
                    res = await api.get<T>(url);
                    break;
                case "post":
                    res = await api.post<T>(url, data);
                    break;
                case "put":
                    res = await api.put<T>(url, data);
                    break;
                case "delete":
                    res = await api.delete<T>(url);
                    break;
                default:
                    throw new Error("Unsupported method");
            }

            return res.data;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    static async fetchCategories(): Promise<TypeCategory[]> {
        try {
            const res = await this.request<ResponseCategories>("get", "/categories");
            if (res && res.statusCode === 200 && res.data) {
                return res.data;
            }
            const message = res?.message?.[0] || "Unknown error";
            showAlert(res?.statusCode || 500, message);
            return [];
        }
        catch (err) {
            showAlert(500, String(err));
            return []
        }
    }
}