<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\CoachController;
use App\Http\Controllers\ClassSessionController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified','role:admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');
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
    Route::get('management-kelas', [ClassSessionController::class,'index'])->name('management-class-session');
});


require __DIR__.'/settings.php';
