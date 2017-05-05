module RivaldoState.Sample exposing (..)

import Json.Encode as E


dog : E.Value
dog =
    E.object
        [ ( "name", E.string "pochi" )
        , ( "id", E.string "9099" )
        ]


person : E.Value
person =
    E.object
        [ ( "name", E.string "Tom" )
        , ( "age", E.int 42 )
        , ( "isMan", E.bool True )
        , ( "favoriteNums", E.list [ E.int 9, E.int 10 ] )
        , ( "dogs", E.list [ dog, dog, dog ] )
        ]


ev : E.Value
ev =
    E.object
        [ ( "persons", E.list [ person, person, person ] )
        , ( "event", E.string "event" )
        ]
