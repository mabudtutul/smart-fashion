<?php

return [
    /*
    | PocketBase storage layout: pb_data/storage/{collectionId}/{recordId}/{filename}
    */
    'pocketbase' => [
        'products_collection_id' => env('PB_IMPORT_PRODUCTS_COLLECTION_ID', 'pbc_7792861864'),
        'categories_collection_id' => env('PB_IMPORT_CATEGORIES_COLLECTION_ID', 'pbc_4272526527'),
    ],
];
