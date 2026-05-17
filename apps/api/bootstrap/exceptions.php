<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

return function ($exceptions): void {
    $exceptions->shouldRenderJsonWhen(
        fn (Request $request, Throwable $e) => $request->is('api/*') || $request->expectsJson()
    );

    $exceptions->render(function (NotFoundHttpException $e, Request $request) {
        if (! $request->is('api/*')) {
            return null;
        }

        return response()->json([
            'message' => 'Not found.',
        ], 404);
    });

    $exceptions->render(function (AuthenticationException $e, Request $request) {
        if (! $request->is('api/*')) {
            return null;
        }

        return response()->json([
            'message' => 'Unauthenticated.',
        ], 401);
    });

    $exceptions->render(function (Throwable $e, Request $request) {
        if (! $request->is('api/*') || $e instanceof ValidationException) {
            return null;
        }

        $status = $e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500;
        $payload = ['message' => $status >= 500 ? 'Server error.' : $e->getMessage()];

        if (config('app.debug') && $status >= 500) {
            $payload['exception'] = class_basename($e);
        }

        return response()->json($payload, $status);
    });
};
