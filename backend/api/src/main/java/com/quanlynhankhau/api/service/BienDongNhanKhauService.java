// src/main/java/com/quanlynhankhau/api/service/BienDongNhanKhauService.java

package com.quanlynhankhau.api.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.quanlynhankhau.api.dto.*;
import com.quanlynhankhau.api.entity.BienDongNhanKhau;
import com.quanlynhankhau.api.entity.BienDongNhanKhau.LoaiBienDong;
import com.quanlynhankhau.api.entity.HoKhau;
import com.quanlynhankhau.api.entity.NhanKhau;
import com.quanlynhankhau.api.entity.NhanKhau.TrangThai;
import com.quanlynhankhau.api.repository.BienDongNhanKhauRepository;
import com.quanlynhankhau.api.repository.HoKhauRepository;
import com.quanlynhankhau.api.repository.NhanKhauRepository;

@Service
@Transactional
public class BienDongNhanKhauService {

    @Autowired
    private BienDongNhanKhauRepository bienDongRepository;

    @Autowired
    private NhanKhauRepository nhanKhauRepository;

    @Autowired
    private HoKhauRepository hoKhauRepository;

    // ===== KHAI SINH =====
    public NhanKhau khaiSinh(Long hoKhauId, KhaiSinhRequestDTO request) {
        // Tìm hộ khẩu
        HoKhau hoKhau = hoKhauRepository.findById(hoKhauId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hộ khẩu với ID: " + hoKhauId));

        // Tạo nhân khẩu mới (trẻ sơ sinh)
        NhanKhau newborn = new NhanKhau();
        newborn.setHoTen(request.getHoTen());
        newborn.setNgaySinh(request.getNgaySinh());
        newborn.setGioiTinh(request.getGioiTinh());
        newborn.setNoiSinh(request.getNoiSinh() != null ? request.getNoiSinh() : "Tại nhà");
        newborn.setQuanHeVoiChuHo(request.getQuanHeVoiChuHo());
        newborn.setQueQuan(hoKhau.getDiaChi()); // Mặc định quê quán là địa chỉ hộ khẩu
        newborn.setDanToc("Kinh"); // Mặc định
        newborn.setNgayDangKyThuongTru(LocalDate.now());
        newborn.setDiaChiTruocKhiChuyenDen("Mới sinh");
        newborn.setTrangThai(TrangThai.THUONG_TRU);
        newborn.setHoKhau(hoKhau);

        // Lưu ghi chú về cha mẹ
        String ghiChu = "";
        if (request.getHoTenCha() != null) {
            ghiChu += "Cha: " + request.getHoTenCha() + ". ";
        }
        if (request.getHoTenMe() != null) {
            ghiChu += "Mẹ: " + request.getHoTenMe() + ". ";
        }
        if (request.getGhiChu() != null) {
            ghiChu += request.getGhiChu();
        }

        // Lưu nhân khẩu
        NhanKhau savedNhanKhau = nhanKhauRepository.save(newborn);

        // Ghi lịch sử biến động
        BienDongNhanKhau bienDong = new BienDongNhanKhau();
        bienDong.setNhanKhau(savedNhanKhau);
        bienDong.setLoaiBienDong(LoaiBienDong.KHAI_SINH);
        bienDong.setNgayBienDong(request.getNgaySinh());
        bienDong.setGhiChu(ghiChu);
        bienDong.setNguoiThucHien(request.getNguoiKhaiBao());
        bienDong.setCreatedAt(LocalDateTime.now());

        bienDongRepository.save(bienDong);

        return savedNhanKhau;
    }

    // ===== KHAI TỬ =====
    public void khaiTu(Long nhanKhauId, KhaiTuRequestDTO request) {
        // Tìm nhân khẩu
        NhanKhau nhanKhau = nhanKhauRepository.findById(nhanKhauId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân khẩu với ID: " + nhanKhauId));

        // Cập nhật trạng thái và thông tin khai tử
        nhanKhau.setTrangThai(TrangThai.DA_MAT);
        nhanKhau.setNgayMat(request.getNgayMat());
        nhanKhau.setNoiMat(request.getNoiMat());
        nhanKhau.setNguyenNhanMat(request.getNguyenNhanMat());

        nhanKhauRepository.save(nhanKhau);

        // Kiểm tra nếu người này là chủ hộ
        if ("Chủ hộ".equals(nhanKhau.getQuanHeVoiChuHo()) && nhanKhau.getHoKhau() != null) {
            // TODO: Thông báo cần chọn chủ hộ mới
            // Có thể throw exception hoặc tạo notification
        }

        // Ghi lịch sử biến động
        BienDongNhanKhau bienDong = new BienDongNhanKhau();
        bienDong.setNhanKhau(nhanKhau);
        bienDong.setLoaiBienDong(LoaiBienDong.KHAI_TU);
        bienDong.setNgayBienDong(request.getNgayMat());
        bienDong.setNoiChuyen(request.getNoiMat());
        bienDong.setLyDo(request.getNguyenNhanMat());
        bienDong.setGhiChu(request.getGhiChu());
        bienDong.setNguoiThucHien(request.getNguoiKhaiBao());
        bienDong.setCreatedAt(LocalDateTime.now());

        bienDongRepository.save(bienDong);
    }

    // ===== CHUYỂN ĐI =====
    public void chuyenDi(Long nhanKhauId, ChuyenDiRequestDTO request) {
        // Tìm nhân khẩu
        NhanKhau nhanKhau = nhanKhauRepository.findById(nhanKhauId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân khẩu với ID: " + nhanKhauId));

        // Cập nhật trạng thái và thông tin chuyển đi
        nhanKhau.setTrangThai(TrangThai.DA_CHUYEN_DI);
        nhanKhau.setNgayChuyenDi(request.getNgayChuyenDi());
        nhanKhau.setNoiChuyenDen(request.getNoiChuyenDen());
        nhanKhau.setLyDoChuyen(request.getLyDoChuyen());

        nhanKhauRepository.save(nhanKhau);

        // Kiểm tra nếu người này là chủ hộ
        if ("Chủ hộ".equals(nhanKhau.getQuanHeVoiChuHo()) && nhanKhau.getHoKhau() != null) {
            // TODO: Thông báo cần chọn chủ hộ mới
        }

        // Ghi lịch sử biến động
        BienDongNhanKhau bienDong = new BienDongNhanKhau();
        bienDong.setNhanKhau(nhanKhau);
        bienDong.setLoaiBienDong(LoaiBienDong.CHUYEN_DI);
        bienDong.setNgayBienDong(request.getNgayChuyenDi());
        bienDong.setNoiChuyen(request.getNoiChuyenDen());
        bienDong.setLyDo(request.getLyDoChuyen());
        bienDong.setGhiChu(request.getGhiChu());
        bienDong.setNguoiThucHien(request.getNguoiKhaiBao());
        bienDong.setCreatedAt(LocalDateTime.now());

        bienDongRepository.save(bienDong);
    }

    // ===== LẤY LỊCH SỬ BIẾN ĐỘNG =====
    public List<BienDongNhanKhauDTO> getLichSuBienDongByNhanKhau(Long nhanKhauId) {
        List<BienDongNhanKhau> bienDongs = bienDongRepository.findByNhanKhauIdOrderByNgayBienDongDesc(nhanKhauId);
        return bienDongs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<BienDongNhanKhauDTO> getLichSuBienDongByHoKhau(Long hoKhauId) {
        List<BienDongNhanKhau> bienDongs = bienDongRepository.findByHoKhauId(hoKhauId);
        return bienDongs.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // ===== THỐNG KÊ =====
    public ThongKeBienDongDTO getThongKeBienDong(LocalDate startDate, LocalDate endDate) {
        // Nếu không có ngày, mặc định lấy 30 ngày gần nhất
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        // Lấy tất cả biến động trong khoảng thời gian
        List<BienDongNhanKhau> bienDongs = bienDongRepository.findByNgayBienDongBetweenOrderByNgayBienDongDesc(startDate, endDate);

        // Đếm theo loại
        long soKhaiSinh = bienDongs.stream().filter(bd -> bd.getLoaiBienDong() == LoaiBienDong.KHAI_SINH).count();
        long soKhaiTu = bienDongs.stream().filter(bd -> bd.getLoaiBienDong() == LoaiBienDong.KHAI_TU).count();
        long soChuyenDi = bienDongs.stream().filter(bd -> bd.getLoaiBienDong() == LoaiBienDong.CHUYEN_DI).count();
        long soChuyenDen = bienDongs.stream().filter(bd -> bd.getLoaiBienDong() == LoaiBienDong.CHUYEN_DEN).count();

        // Tạo map thống kê
        Map<String, Long> thongKeTheoLoai = new HashMap<>();
        for (LoaiBienDong loai : LoaiBienDong.values()) {
            long count = bienDongs.stream().filter(bd -> bd.getLoaiBienDong() == loai).count();
            thongKeTheoLoai.put(loai.getDisplayName(), count);
        }

        return new ThongKeBienDongDTO(
                (long) bienDongs.size(),
                soKhaiSinh,
                soKhaiTu,
                soChuyenDi,
                soChuyenDen,
                thongKeTheoLoai
        );
    }

    // ===== HELPER METHODS =====
    private BienDongNhanKhauDTO convertToDTO(BienDongNhanKhau entity) {
        BienDongNhanKhauDTO dto = new BienDongNhanKhauDTO();
        dto.setId(entity.getId());
        dto.setNhanKhauId(entity.getNhanKhau().getId());
        dto.setHoTenNhanKhau(entity.getNhanKhau().getHoTen());
        dto.setCmndCccd(entity.getNhanKhau().getCmndCccd());
        dto.setLoaiBienDong(entity.getLoaiBienDong().name());
        dto.setLoaiBienDongDisplay(entity.getLoaiBienDong().getDisplayName());
        dto.setNgayBienDong(entity.getNgayBienDong());
        dto.setNoiChuyen(entity.getNoiChuyen());
        dto.setLyDo(entity.getLyDo());
        dto.setGhiChu(entity.getGhiChu());
        dto.setNguoiThucHien(entity.getNguoiThucHien());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}