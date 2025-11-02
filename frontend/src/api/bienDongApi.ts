// src/api/bienDongApi.ts

import axiosClient from './axiosClient';

// ===== INTERFACES =====

export interface KhaiSinhRequest {
    hoTen: string;
    ngaySinh: string;
    gioiTinh: string;
    noiSinh?: string;
    quanHeVoiChuHo: string;
    hoTenCha?: string;
    hoTenMe?: string;
    ghiChu?: string;
    nguoiKhaiBao: string;
}

export interface KhaiTuRequest {
    ngayMat: string;
    noiMat?: string;
    nguyenNhanMat?: string;
    ghiChu?: string;
    nguoiKhaiBao: string;
}

export interface ChuyenDiRequest {
    ngayChuyenDi: string;
    noiChuyenDen: string;
    lyDoChuyen?: string;
    ghiChu?: string;
    nguoiKhaiBao: string;
}

export interface BienDongNhanKhau {
    id: number;
    nhanKhauId: number;
    hoTenNhanKhau: string;
    cmndCccd?: string;
    loaiBienDong: string;
    loaiBienDongDisplay: string;
    ngayBienDong: string;
    noiChuyen?: string;
    lyDo?: string;
    ghiChu?: string;
    nguoiThucHien: string;
    createdAt: string;
}

export interface ThongKeBienDong {
    tongSoBienDong: number;
    soKhaiSinh: number;
    soKhaiTu: number;
    soChuyenDi: number;
    soChuyenDen: number;
    thongKeTheoLoai: { [key: string]: number };
}

// ===== API FUNCTIONS =====

// Khai sinh
export const khaiSinh = async (hoKhauId: number, data: KhaiSinhRequest) => {
    const response = await axiosClient.post(`/bien-dong/khai-sinh/${hoKhauId}`, data);
    return response.data;
};

// Khai tử
export const khaiTu = async (nhanKhauId: number, data: KhaiTuRequest) => {
    const response = await axiosClient.post(`/bien-dong/khai-tu/${nhanKhauId}`, data);
    return response.data;
};

// Chuyển đi
export const chuyenDi = async (nhanKhauId: number, data: ChuyenDiRequest) => {
    const response = await axiosClient.post(`/bien-dong/chuyen-di/${nhanKhauId}`, data);
    return response.data;
};

// Lấy lịch sử biến động của nhân khẩu
export const getLichSuBienDongByNhanKhau = async (nhanKhauId: number): Promise<BienDongNhanKhau[]> => {
    const response = await axiosClient.get(`/bien-dong/nhan-khau/${nhanKhauId}`);
    return response.data;
};

// Lấy lịch sử biến động của hộ khẩu
export const getLichSuBienDongByHoKhau = async (hoKhauId: number): Promise<BienDongNhanKhau[]> => {
    const response = await axiosClient.get(`/bien-dong/ho-khau/${hoKhauId}`);
    return response.data;
};

// Thống kê biến động
export const getThongKeBienDong = async (startDate?: string, endDate?: string): Promise<ThongKeBienDong> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await axiosClient.get(`/bien-dong/thong-ke?${params.toString()}`);
    return response.data;
};