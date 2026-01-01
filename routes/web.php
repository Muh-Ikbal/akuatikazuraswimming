<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CourseController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
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
});


require __DIR__.'/settings.php';
