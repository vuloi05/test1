// src/main/java/com/quanlynhankhau/api/controller/BienDongNhanKhauController.java

package com.quanlynhankhau.api.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.quanlynhankhau.api.dto.*;
import com.quanlynhankhau.api.entity.NhanKhau;
import com.quanlynhankhau.api.service.BienDongNhanKhauService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bien-dong")
@CrossOrigin(origins = "http://localhost:5173")
public class BienDongNhanKhauController {

    @Autowired
    private BienDongNhanKhauService bienDongService;

    /**
     * API Khai sinh - Thêm trẻ sơ sinh vào hộ khẩu
     * POST /api/bien-dong/khai-sinh/{hoKhauId}
     */
    @PostMapping("/khai-sinh/{hoKhauId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> khaiSinh(
            @PathVariable Long hoKhauId,
            @Valid @RequestBody KhaiSinhRequestDTO request) {
        try {
            NhanKhau newborn = bienDongService.khaiSinh(hoKhauId, request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Khai sinh thành công");
            response.put("data", newborn);

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * API Khai tử - Đánh dấu nhân khẩu đã mất
     * POST /api/bien-dong/khai-tu/{nhanKhauId}
     */
    @PostMapping("/khai-tu/{nhanKhauId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> khaiTu(
            @PathVariable Long nhanKhauId,
            @Valid @RequestBody KhaiTuRequestDTO request) {
        try {
            bienDongService.khaiTu(nhanKhauId, request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Khai tử thành công");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * API Chuyển đi - Đánh dấu nhân khẩu chuyển đi
     * POST /api/bien-dong/chuyen-di/{nhanKhauId}
     */
    @PostMapping("/chuyen-di/{nhanKhauId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> chuyenDi(
            @PathVariable Long nhanKhauId,
            @Valid @RequestBody ChuyenDiRequestDTO request) {
        try {
            bienDongService.chuyenDi(nhanKhauId, request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Ghi nhận chuyển đi thành công");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * API Lấy lịch sử biến động của một nhân khẩu
     * GET /api/bien-dong/nhan-khau/{nhanKhauId}
     */
    @GetMapping("/nhan-khau/{nhanKhauId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<BienDongNhanKhauDTO>> getLichSuByNhanKhau(@PathVariable Long nhanKhauId) {
        List<BienDongNhanKhauDTO> lichSu = bienDongService.getLichSuBienDongByNhanKhau(nhanKhauId);
        return ResponseEntity.ok(lichSu);
    }

    /**
     * API Lấy lịch sử biến động của một hộ khẩu
     * GET /api/bien-dong/ho-khau/{hoKhauId}
     */
    @GetMapping("/ho-khau/{hoKhauId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<BienDongNhanKhauDTO>> getLichSuByHoKhau(@PathVariable Long hoKhauId) {
        List<BienDongNhanKhauDTO> lichSu = bienDongService.getLichSuBienDongByHoKhau(hoKhauId);
        return ResponseEntity.ok(lichSu);
    }

    /**
     * API Thống kê biến động
     * GET /api/bien-dong/thong-ke?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd
     */
    @GetMapping("/thong-ke")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<ThongKeBienDongDTO> getThongKe(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        ThongKeBienDongDTO thongKe = bienDongService.getThongKeBienDong(startDate, endDate);
        return ResponseEntity.ok(thongKe);
    }
}