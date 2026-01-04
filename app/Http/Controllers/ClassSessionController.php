<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClassSession;
use Inertia\Inertia;


class ClassSessionController extends Controller
{
    public function index(){
        $class_session = ClassSession::with('course', 'coach')->paginate(10);
        return Inertia::render('admin/class_session', [
            'class_session' => $class_session
        ]);
    }
}
