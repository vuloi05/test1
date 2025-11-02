// src/main/java/com/quanlynhankhau/api/entity/BienDongNhanKhau.java

package com.quanlynhankhau.api.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "bien_dong_nhan_khau")
@Getter
@Setter
public class BienDongNhanKhau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_khau_id", nullable = false)
    @JsonBackReference
    private NhanKhau nhanKhau;

    @Column(name = "loai_bien_dong", nullable = false)
    @Enumerated(EnumType.STRING)
    private LoaiBienDong loaiBienDong;

    @Column(name = "ngay_bien_dong", nullable = false)
    private LocalDate ngayBienDong;

    @Column(name = "noi_chuyen", length = 500)
    private String noiChuyen;

    @Column(name = "ly_do", columnDefinition = "TEXT")
    private String lyDo;

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "nguoi_thuc_hien")
    private String nguoiThucHien;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Enum để định nghĩa các loại biến động
    public enum LoaiBienDong {
        KHAI_SINH("Khai sinh"),
        KHAI_TU("Khai tử"),
        CHUYEN_DI("Chuyển đi"),
        CHUYEN_DEN("Chuyển đến"),
        THAY_DOI_CHU_HO("Thay đổi chủ hộ"),
        THAY_DOI_KHAC("Thay đổi khác");

        private final String displayName;

        LoaiBienDong(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}