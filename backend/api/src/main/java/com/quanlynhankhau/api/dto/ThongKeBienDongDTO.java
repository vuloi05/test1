// src/main/java/com/quanlynhankhau/api/dto/ThongKeBienDongDTO.java

package com.quanlynhankhau.api.dto;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ThongKeBienDongDTO {
    private Long tongSoBienDong;
    private Long soKhaiSinh;
    private Long soKhaiTu;
    private Long soChuyenDi;
    private Long soChuyenDen;
    private Map<String, Long> thongKeTheoLoai;
}
