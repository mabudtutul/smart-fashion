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

    $exceptions->render(function (ValidationException $e, Request $request) {
        if (! $request->is('api/*')) {
            return null;
        }

        $first = collect($e->errors())->flatten()->first();

        return response()->json([
            'message' => $first ? (string) $first : 'Validation failed.',
            'errors' => $e->errors(),
        ], 422);
    });

    $exceptions->render(function (Throwable $e, Request $request) {
        if (! $request->is('api/*')) {
            return null;
        }

        $status = $e instanceof HttpExceptionInterface ? $e->getStatusCode() : 500;
        $isUpload = str_contains($request->path(), '/image');

        $message = $status >= 500
            ? ($isUpload
                ? 'Image upload failed on the server.'
                : 'Server error.')
            : $e->getMessage();

        $payload = ['message' => $message];

        if ($status >= 500 && $isUpload) {
            $payload['hint'] = 'Verify UPLOADS_ROOT, public_html/uploads permissions, and PHP GD/WebP on Hostinger.';
        }

        if (config('app.debug')) {
            $payload['exception'] = class_basename($e);
            if ($status >= 500) {
                $payload['debug'] = $e->getMessage();
            }
        }

        return response()->json($payload, $status);
    });
};
