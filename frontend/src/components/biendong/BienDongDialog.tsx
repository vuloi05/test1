// src/components/biendong/BienDongDialog.tsx

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { KhaiTuRequest, ChuyenDiRequest } from '../../api/bienDongApi';

// Schema cho khai tử
const khaiTuSchema = z.object({
    ngayMat: z.string().min(1, 'Ngày mất là bắt buộc'),
    noiMat: z.string().optional(),
    nguyenNhanMat: z.string().optional(),
    ghiChu: z.string().optional(),
    nguoiKhaiBao: z.string().min(1, 'Người khai báo là bắt buộc'),
});

// Schema cho chuyển đi
const chuyenDiSchema = z.object({
    ngayChuyenDi: z.string().min(1, 'Ngày chuyển đi là bắt buộc'),
    noiChuyenDen: z.string().min(1, 'Nơi chuyển đến là bắt buộc'),
    lyDoChuyen: z.string().optional(),
    ghiChu: z.string().optional(),
    nguoiKhaiBao: z.string().min(1, 'Người khai báo là bắt buộc'),
});

interface BienDongDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: any) => Promise<void>;
    type: 'khaiTu' | 'chuyenDi';
    nhanKhau: {
        id: number;
        hoTen: string;
        cmndCccd?: string;
    } | null;
}

export default function BienDongDialog({ open, onClose, onConfirm, type, nhanKhau }: BienDongDialogProps) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isKhaiTu = type === 'khaiTu';
    const schema = isKhaiTu ? khaiTuSchema : chuyenDiSchema;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: isKhaiTu ? {
            ngayMat: new Date().toISOString().split('T')[0],
            noiMat: '',
            nguyenNhanMat: '',
            ghiChu: '',
            nguoiKhaiBao: 'Admin',
        } : {
            ngayChuyenDi: new Date().toISOString().split('T')[0],
            noiChuyenDen: '',
            lyDoChuyen: '',
            ghiChu: '',
            nguoiKhaiBao: 'Admin',
        }
    });

    const handleFormSubmit = async (data: any) => {
        setSubmitting(true);
        setError(null);
        try {
            await onConfirm(data);
            reset();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra');
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

    if (!nhanKhau) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        <WarningIcon color="warning" />
                        <Typography variant="h6">
                            {isKhaiTu ? 'Khai tử' : 'Khai báo chuyển đi'}
                        </Typography>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        {error && (
                            <Alert severity="error" onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}

                        <Alert severity="warning">
                            {isKhaiTu
                                ? `Bạn đang khai tử cho nhân khẩu: ${nhanKhau.hoTen}. Hành động này sẽ cập nhật trạng thái nhân khẩu thành "Đã mất".`
                                : `Bạn đang khai báo chuyển đi cho nhân khẩu: ${nhanKhau.hoTen}. Hành động này sẽ cập nhật trạng thái nhân khẩu thành "Đã chuyển đi".`
                            }
                        </Alert>

                        {/* Fields cho Khai tử */}
                        {isKhaiTu && (
                            <>
                                <Controller
                                    name="ngayMat"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Ngày mất"
                                            type="date"
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.ngayMat}
                                            helperText={(errors as any).ngayMat?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="noiMat"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Nơi mất"
                                            fullWidth
                                            error={!!errors.noiMat}
                                            helperText={(errors as any).noiMat?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="nguyenNhanMat"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Nguyên nhân"
                                            fullWidth
                                            multiline
                                            rows={2}
                                            error={!!errors.nguyenNhanMat}
                                            helperText={(errors as any).nguyenNhanMat?.message}
                                        />
                                    )}
                                />
                            </>
                        )}

                        {/* Fields cho Chuyển đi */}
                        {!isKhaiTu && (
                            <>
                                <Controller
                                    name="ngayChuyenDi"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Ngày chuyển đi"
                                            type="date"
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            error={!!errors.ngayChuyenDi}
                                            helperText={(errors as any).ngayChuyenDi?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="noiChuyenDen"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Nơi chuyển đến"
                                            fullWidth
                                            required
                                            error={!!errors.noiChuyenDen}
                                            helperText={(errors as any).noiChuyenDen?.message}
                                            placeholder="Ví dụ: Số 10, Phường 5, Quận 10, TP.HCM"
                                        />
                                    )}
                                />

                                <Controller
                                    name="lyDoChuyen"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel>Lý do chuyển</InputLabel>
                                            <Select {...field} label="Lý do chuyển">
                                                <MenuItem value="">Chọn lý do</MenuItem>
                                                <MenuItem value="Công tác">Công tác</MenuItem>
                                                <MenuItem value="Học tập">Học tập</MenuItem>
                                                <MenuItem value="Kết hôn">Kết hôn</MenuItem>
                                                <MenuItem value="Chuyển nhà">Chuyển nhà</MenuItem>
                                                <MenuItem value="Khác">Khác</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </>
                        )}

                        {/* Common fields */}
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
                                    helperText={(errors as any).ghiChu?.message}
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
                                    helperText={(errors as any).nguoiKhaiBao?.message}
                                />
                            )}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} disabled={submitting}>
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="warning"
                        disabled={submitting}
                    >
                        {submitting ? 'Đang xử lý...' : 'Xác nhận'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}