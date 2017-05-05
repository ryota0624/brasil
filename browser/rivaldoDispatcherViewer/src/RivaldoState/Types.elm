module RivaldoState.Types exposing (..)

import Dict exposing (Dict)
import Json.Decode exposing (..)


type PrimitiveValue
    = PrimitiveValue String


type DictValue
    = DictValue (Dict String SValue)


type ListValue
    = ListValue (List SValue)


type SValue
    = P PrimitiveValue
    | D DictValue
    | L ListValue


toSValue : String -> SValue
toSValue =
    PrimitiveValue >> P


decodeJSON : Decoder SValue
decodeJSON =
    map (DictValue >> D)
        (dict
            (oneOf
                [ lazy (\_ -> decodeJSON)
                , lazy (\_ -> decodeList)
                , decodePrimitive
                ]
            )
        )


decodeList : Decoder SValue
decodeList =
    map (ListValue >> L)
        (list
            (oneOf
                [ lazy (\_ -> decodeList)
                , lazy (\_ -> decodeJSON)
                , decodePrimitive
                ]
            )
        )


decodePrimitive : Decoder SValue
decodePrimitive =
    oneOf
        [ map (toString >> toSValue) int
        , map (toString >> toSValue) float
        , map (toString >> toSValue) bool
        , map toSValue string
        , map toSValue (null "null")
        ]
