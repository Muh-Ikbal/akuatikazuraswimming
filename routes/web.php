<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\CoachController;
use App\Http\Controllers\ClassSessionController;
use App\Http\Controllers\EnrolmentCourseController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\QRCodeGenerateController;

Route::get('/', function () {
    
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// dashboard
Route::middleware(['auth', 'verified'])->get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::middleware(['auth','verified'])->post('generate-qr-code', [QRCodeGenerateController::class, 'generateQRCode'])->name('generate-qr-code');
Route::middleware(['auth','verified'])->get('qr-code', [QRCodeGenerateController::class,'index'])->name('qrcode');

Route::middleware(['auth', 'verified','role:admin'])->group(function () {
    
    // management course
     Route::get('management-course', [CourseController::class,'index'])->name('management-course');
     Route::get('management-course/create', [CourseController::class,'create'])->name('management-course.create');
     Route::post('management-course', [CourseController::class,'store'])->name('management-course.store');
     Route::get('management-course/{id}', [CourseController::class,'show'])->name('management-course.show');
     Route::get('management-course/edit/{id}', [CourseController::class,'edit'])->name('management-course.edit');
     Route::put('management-course/update/{id}', [CourseController::class,'update'])->name('management-course.update');
     Route::delete('management-course/delete/{id}', [CourseController::class,'destroy'])->name('management-course.delete');
     
    // management user
    Route::get('management-user', [UserController::class,'index'])->name('management-user');
    Route::get('management-user/create', [UserController::class,'create'])->name('management-user.create');
    Route::post('management-user', [UserController::class,'store'])->name('management-user.store');
    Route::get('management-user/edit/{id}', [UserController::class,'edit'])->name('management-user.edit');
    Route::put('management-user/update/{id}', [UserController::class,'update'])->name('management-user.update');
    Route::delete('management-user/{id}', [UserController::class,'destroy'])->name('management-user.destroy');
    
    // management member
    Route::get('management-member', [MemberController::class,'index'])->name('management-member');
    Route::get('management-member/create', [MemberController::class,'create'])->name('management-member.create');
    Route::post('management-member', [MemberController::class,'store'])->name('management-member.store');
    Route::get('management-member/{id}', [MemberController::class,'show'])->name('management-member.show');
    Route::get('management-member/edit/{id}', [MemberController::class,'edit'])->name('management-member.edit');
    Route::put('management-member/update/{id}', [MemberController::class,'update'])->name('management-member.update');
    Route::delete('management-member/{id}', [MemberController::class,'destroy'])->name('management-member.destroy');
    
    // management coach
    Route::get('management-coach', [CoachController::class,'index'])->name('management-coach');
    Route::get('management-coach/create', [CoachController::class,'create'])->name('management-coach.create');
    Route::post('management-coach', [CoachController::class,'store'])->name('management-coach.store');
    Route::get('management-coach/{id}', [CoachController::class,'show'])->name('management-coach.show');
    Route::get('management-coach/edit/{id}', [CoachController::class,'edit'])->name('management-coach.edit');
    Route::put('management-coach/update/{id}', [CoachController::class,'update'])->name('management-coach.update');
    Route::delete('management-coach/{id}', [CoachController::class,'destroy'])->name('management-coach.destroy');

    // management class session
    Route::get('management-kelas', [ClassSessionController::class,'index'])->name('management-kelas');
    Route::get('management-kelas/create', [ClassSessionController::class,'create'])->name('management-kelas.create');
    Route::post('management-kelas', [ClassSessionController::class,'store'])->name('management-kelas.store');
    Route::get('management-kelas/{id}', [ClassSessionController::class,'show'])->name('management-kelas.show');
    Route::get('management-kelas/edit/{id}', [ClassSessionController::class,'edit'])->name('management-kelas.edit');
    Route::put('management-kelas/update/{id}', [ClassSessionController::class,'update'])->name('management-kelas.update');
    Route::delete('management-kelas/{id}', [ClassSessionController::class,'destroy'])->name('management-kelas.destroy');
    
    // management enrolment
    Route::get('management-enrolment', [EnrolmentCourseController::class,'index'])->name('management-enrolment');
    Route::get('management-enrolment/create', [EnrolmentCourseController::class,'create'])->name('management-enrolment.create');
    Route::post('management-enrolment', [EnrolmentCourseController::class,'store'])->name('management-enrolment.store');
    Route::get('management-enrolment/{id}', [EnrolmentCourseController::class,'show'])->name('management-enrolment.show');
    Route::get('management-enrolment/edit/{id}', [EnrolmentCourseController::class,'edit'])->name('management-enrolment.edit');
    Route::put('management-enrolment/update/{id}', [EnrolmentCourseController::class,'update'])->name('management-enrolment.update');
    Route::delete('management-enrolment/{id}', [EnrolmentCourseController::class,'destroy'])->name('management-enrolment.destroy');
    
    // management payment (pemasukan)
    Route::get('management-pemasukan', [PaymentController::class,'index'])->name('management-pemasukan');
    Route::get('management-pemasukan/create', [PaymentController::class,'create'])->name('management-pemasukan.create');
    Route::post('management-pemasukan', [PaymentController::class,'store'])->name('management-pemasukan.store');
    Route::get('management-pemasukan/{id}', [PaymentController::class,'show'])->name('management-pemasukan.show');
    Route::get('management-pemasukan/edit/{id}', [PaymentController::class,'edit'])->name('management-pemasukan.edit');
    Route::put('management-pemasukan/update/{id}', [PaymentController::class,'update'])->name('management-pemasukan.update');
    Route::delete('management-pemasukan/{id}', [PaymentController::class,'destroy'])->name('management-pemasukan.destroy');

    // kategori pengeluaran
    Route::get('kategori-pengeluaran', [ExpenseCategoryController::class,'index'])->name('kategori-pengeluaran');
    Route::get('kategori-pengeluaran/create', [ExpenseCategoryController::class,'create'])->name('kategori-pengeluaran.create');
    Route::post('kategori-pengeluaran', [ExpenseCategoryController::class,'store'])->name('kategori-pengeluaran.store');
    Route::get('kategori-pengeluaran/edit/{id}', [ExpenseCategoryController::class,'edit'])->name('kategori-pengeluaran.edit');
    Route::put('kategori-pengeluaran/update/{id}', [ExpenseCategoryController::class,'update'])->name('kategori-pengeluaran.update');
    Route::delete('kategori-pengeluaran/delete/{id}', [ExpenseCategoryController::class,'destroy'])->name('kategori-pengeluaran.delete');

    // Pengeluaran
    Route::get('management-pengeluaran',[ExpenseController::class,'index'])->name('management-pengeluaran');
    Route::get('management-pengeluaran/create',[ExpenseController::class,'create'])->name('management-pengeluaran.create');
    Route::post('management-pengeluaran',[ExpenseController::class,'store'])->name('management-pengeluaran.store');
    Route::get('management-pengeluaran/{id}',[ExpenseController::class,'edit'])->name('management-pengeluaran.edit');
    Route::put('management-pengeluaran/{id}',[ExpenseController::class,'update'])->name('management-pengeluaran.update');
    Route::delete('management-pengeluaran/{id}',[ExpenseController::class,'destroy'])->name('management-pengeluaran.destroy');

    // management jadwal
    Route::get('management-jadwal',[ScheduleController::class,'index'])->name('management-jadwal');
    Route::get('management-jadwal/create',[ScheduleController::class,'create'])->name('management-jadwal.create');
    Route::post('management-jadwal',[ScheduleController::class,'store'])->name('management-jadwal.store');
    Route::get('management-jadwal/{id}',[ScheduleController::class,'edit'])->name('management-jadwal.edit');
    Route::put('management-jadwal/{id}',[ScheduleController::class,'update'])->name('management-jadwal.update');
    Route::delete('management-jadwal/{id}',[ScheduleController::class,'destroy'])->name('management-jadwal.destroy');


});

Route::middleware(['auth', 'verified','role:member'])->group(function () {
    Route::get('jadwal-member', [\App\Http\Controllers\Member\MemberScheduleController::class, 'index'])->name('jadwal-member');
    Route::get('riwayat-absensi', [\App\Http\Controllers\Member\MemberAttendanceController::class, 'index'])->name('riwayat-absensi');
});

Route::middleware(['auth', 'verified','role:operator'])->group(function () {
    Route::get('scan-qr-member', [\App\Http\Controllers\ScanQRController::class,'index'])->name('scan-qr-member');
    Route::post('scan-qr-member/verify', [\App\Http\Controllers\ScanQRController::class,'verify'])->name('scan-qr-member.verify');
});


require __DIR__.'/settings.php';
