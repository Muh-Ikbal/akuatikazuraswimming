<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\UserController;

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
});


require __DIR__.'/settings.php';
