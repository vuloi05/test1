// src/main/java/com/quanlynhankhau/api/repository/BienDongNhanKhauRepository.java

package com.quanlynhankhau.api.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.quanlynhankhau.api.entity.BienDongNhanKhau;
import com.quanlynhankhau.api.entity.BienDongNhanKhau.LoaiBienDong;

@Repository
public interface BienDongNhanKhauRepository extends JpaRepository<BienDongNhanKhau, Long> {

    // Tìm lịch sử biến động của một nhân khẩu
    List<BienDongNhanKhau> findByNhanKhauIdOrderByNgayBienDongDesc(Long nhanKhauId);

    // Tìm lịch sử biến động của một hộ khẩu
    @Query("SELECT bd FROM BienDongNhanKhau bd " +
            "WHERE bd.nhanKhau.hoKhau.id = :hoKhauId " +
            "ORDER BY bd.ngayBienDong DESC")
    List<BienDongNhanKhau> findByHoKhauId(@Param("hoKhauId") Long hoKhauId);

    // Tìm theo loại biến động
    List<BienDongNhanKhau> findByLoaiBienDongOrderByNgayBienDongDesc(LoaiBienDong loaiBienDong);

    // Tìm biến động trong khoảng thời gian
    List<BienDongNhanKhau> findByNgayBienDongBetweenOrderByNgayBienDongDesc(
            LocalDate startDate, LocalDate endDate);

    // Thống kê số lượng biến động theo loại
    @Query("SELECT bd.loaiBienDong, COUNT(bd) FROM BienDongNhanKhau bd " +
            "WHERE bd.ngayBienDong BETWEEN :startDate AND :endDate " +
            "GROUP BY bd.loaiBienDong")
    List<Object[]> countByLoaiBienDong(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // Tìm biến động gần nhất của một nhân khẩu
    @Query("SELECT bd FROM BienDongNhanKhau bd " +
            "WHERE bd.nhanKhau.id = :nhanKhauId " +
            "ORDER BY bd.ngayBienDong DESC " +
            "LIMIT 1")
    BienDongNhanKhau findLatestByNhanKhauId(@Param("nhanKhauId") Long nhanKhauId);
}