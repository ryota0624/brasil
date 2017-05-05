module RivaldoState.Utils exposing (..)

import Dict exposing (Dict)
import RivaldoState.Types as Types exposing (..)


calcPropertiyCount : SValue -> Int
calcPropertiyCount v =
    case v of
        P _ ->
            1

        D (DictValue d) ->
            (calcDictPropertyCount d)

        L _ ->
            1


calcDictPropertyCount : Dict String SValue -> Int
calcDictPropertyCount =
    Dict.foldr (\key v amount -> calcPropertiyCount (v) + amount) 0


type Cell
    = Cell Int
    | CellList Cell Int
    | CellDict (Dict String Cell) Int


toCellStructure : SValue -> Cell
toCellStructure v =
    case v of
        P _ ->
            Cell 1

        L (ListValue list) ->
            listToCellStructure list

        D (DictValue d) ->
            dictToCellStructure d


listToCellStructure : List SValue -> Cell
listToCellStructure list =
    let
        size =
            List.length <| list

        cell =
            if list |> List.isEmpty then
                Cell 1
            else
                Cell 1
    in
        CellList cell size


dictToCellStructure : Dict String SValue -> Cell
dictToCellStructure dict =
    let
        size =
            Dict.size dict

        cellDict =
            Dict.map (\k v -> toCellStructure v) dict
    in
        CellDict cellDict size
