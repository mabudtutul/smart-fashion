<?php

namespace App\Support;

use Illuminate\Support\Str;

final class PocketBaseId
{
    /** Generate a 15-char lowercase alphanumeric id (PocketBase-compatible). */
    public static function generate(): string
    {
        $alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';

        do {
            $id = '';
            for ($i = 0; $i < 15; $i++) {
                $id .= $alphabet[random_int(0, strlen($alphabet) - 1)];
            }
        } while (! preg_match('/^[a-z0-9]{15}$/', $id));

        return $id;
    }
}
