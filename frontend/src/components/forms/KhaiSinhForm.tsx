// src/components/forms/KhaiSinhForm.tsx

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import type { KhaiSinhRequest } from '../../api/bienDongApi';

const khaiSinhSchema = z.object({
    hoTen: z.string().min(1, 'Họ tên là bắt buộc'),
    ngaySinh: z.string().min(1, 'Ngày sinh là bắt buộc'),
    gioiTinh: z.string().min(1, 'Giới tính là bắt buộc'),
    noiSinh: z.string().optional(),
    quanHeVoiChuHo: z.string().min(1, 'Quan hệ với chủ hộ là bắt buộc'),
    hoTenCha: z.string().optional(),
    hoTenMe: z.string().optional(),
    ghiChu: z.string().optional(),
    nguoiKhaiBao: z.string().min(1, 'Người khai báo là bắt buộc'),
});

interface KhaiSinhFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: KhaiSinhRequest) => Promise<void>;
    hoKhauId: number;
}

export default function KhaiSinhForm({ open, onClose, onSubmit, hoKhauId }: KhaiSinhFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<KhaiSinhRequest>({
        resolver: zodResolver(khaiSinhSchema),
        defaultValues: {
            hoTen: '',
            ngaySinh: new Date().toISOString().split('T')[0],
            gioiTinh: '',
            noiSinh: 'Tại nhà',
            quanHeVoiChuHo: 'Con',
            hoTenCha: '',
            hoTenMe: '',
            ghiChu: '',
            nguoiKhaiBao: 'Admin', // Lấy từ context user sau
        }
    });

    const handleFormSubmit = async (data: KhaiSinhRequest) => {
        setSubmitting(true);
        setError(null);
        try {
            await onSubmit(data);
            reset();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi khai sinh');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!submitting) {
            reset();
            setError(null);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        Khai sinh mới
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        {error && (
                            <Alert severity="error" onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}

                        <Typography variant="subtitle2" color="text.secondary">
                            Thông tin trẻ sơ sinh
                        </Typography>

                        <Controller
                            name="hoTen"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Họ và tên"
                                    fullWidth
                                    required
                                    error={!!errors.hoTen}
                                    helperText={errors.hoTen?.message}
                                />
                            )}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Controller
                                name="ngaySinh"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Ngày sinh"
                                        type="date"
                                        fullWidth
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.ngaySinh}
                                        helperText={errors.ngaySinh?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="gioiTinh"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth required error={!!errors.gioiTinh}>
                                        <InputLabel>Giới tính</InputLabel>
                                        <Select {...field} label="Giới tính">
                                            <MenuItem value="">Chọn giới tính</MenuItem>
                                            <MenuItem value="Nam">Nam</MenuItem>
                                            <MenuItem value="Nữ">Nữ</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Box>

                        <Controller
                            name="noiSinh"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nơi sinh"
                                    fullWidth
                                    error={!!errors.noiSinh}
                                    helperText={errors.noiSinh?.message}
                                />
                            )}
                        />

                        <Controller
                            name="quanHeVoiChuHo"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth required error={!!errors.quanHeVoiChuHo}>
                                    <InputLabel>Quan hệ với chủ hộ</InputLabel>
                                    <Select {...field} label="Quan hệ với chủ hộ">
                                        <MenuItem value="">Chọn quan hệ</MenuItem>
                                        <MenuItem value="Con">Con</MenuItem>
                                        <MenuItem value="Cháu">Cháu</MenuItem>
                                        <MenuItem value="Khác">Khác</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />

                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                            Thông tin cha mẹ
                        </Typography>

                        <Controller
                            name="hoTenCha"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Họ tên cha"
                                    fullWidth
                                    error={!!errors.hoTenCha}
                                    helperText={errors.hoTenCha?.message}
                                />
                            )}
                        />

                        <Controller
                            name="hoTenMe"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Họ tên mẹ"
                                    fullWidth
                                    error={!!errors.hoTenMe}
                                    helperText={errors.hoTenMe?.message}
                                />
                            )}
                        />

                        <Controller
                            name="ghiChu"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Ghi chú"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    error={!!errors.ghiChu}
                                    helperText={errors.ghiChu?.message}
                                />
                            )}
                        />

                        <Controller
                            name="nguoiKhaiBao"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Người khai báo"
                                    fullWidth
                                    required
                                    error={!!errors.nguoiKhaiBao}
                                    helperText={errors.nguoiKhaiBao?.message}
                                />
                            )}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} disabled={submitting}>
                        Hủy
                    </Button>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting ? 'Đang xử lý...' : 'Xác nhận'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}