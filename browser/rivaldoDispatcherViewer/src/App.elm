port module App exposing (..)

import Html exposing (thead, li, ul, td, Html, text, div, img, p, th, tr, tbody, table)
import RivaldoState.Types as Types
import RivaldoState.Utils as Utils
import Json.Decode exposing (..)
import Dict exposing (Dict)


--

import Html.Attributes exposing (style, src, colspan, class)


---- MODEL ----


type alias Model =
    { events : List Types.SValue
    }


init : String -> ( Model, Cmd Msg )
init path =
    ( { events = [] }, Cmd.none )



---- UPDATE ----


type Msg
    = ReceiveEvent Types.SValue


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ReceiveEvent event ->
            { model | events = [ event ] ++ model.events } ! []



---- Port ----


port receiveEvent : (Value -> msg) -> Sub msg


receivEventHelper : Value -> Types.SValue
receivEventHelper v =
    case decodeValue Types.decodeJSON v of
        Ok v ->
            v

        Err err ->
            Debug.crash err



---- VIEW ----


view : Model -> Html Msg
view model =
    let
        d json =
            (decodeValue Types.decodeJSON json)
                |> Result.toMaybe
                |> Maybe.map always
                |> Maybe.withDefault (\_ -> Debug.crash "crash")

        calcText json label =
            decodeValue Types.decodeJSON json
                |> Result.map (Utils.calcPropertiyCount >> toString >> ((++) label) >> Html.text)
                |> Result.toMaybe
                |> Maybe.withDefault (Html.text "invalid")
    in
        div []
            (model.events |> List.map renderRoot)


renderRoot : Types.SValue -> Html msg
renderRoot v =
    let
        renderRootDict : Types.DictValue -> Html msg
        renderRootDict (Types.DictValue dict) =
            let
                tables =
                    Dict.map (\k v -> renderCollection v) dict
                        |> Dict.values
            in
                div [ class "root_collection" ] tables
    in
        case v of
            Types.L list ->
                renderList list

            Types.D dict ->
                renderRootDict dict

            Types.P (Types.PrimitiveValue v) ->
                Html.text v


renderHeader : Types.SValue -> Html msg
renderHeader v =
    case v of
        Types.L (Types.ListValue list) ->
            let
                createHeaders item =
                    item
                        |> Dict.keys
                        |> List.map (\k -> th [] [ Html.text k ])
                        |> (\headers -> tr [] headers)
            in
                case list of
                    (Types.D (Types.DictValue dict)) :: _ ->
                        createHeaders dict

                    _ ->
                        Html.text "empty list"

        --                list
        --                    |> List.head
        --                    |> Maybe.map
        --                        (\item ->
        --                            case item of
        --                                Types.D (Types.DictValue dict) ->
        --                                    createHeaders dict
        --
        --                                _ ->
        --                                    Html.text "not object"
        --                        )
        --                    |> Maybe.withDefault (Html.text "empty list")
        Types.D dict ->
            renderDict dict

        Types.P (Types.PrimitiveValue v) ->
            Html.text <| v ++ "="


(=>) : a -> b -> ( a, b )
(=>) =
    (,)


renderCollection : Types.SValue -> Html msg
renderCollection v =
    let
        tableStyle =
            style [ "border" => "2px solid black" ]

        -- rootのテーブルは専用のリスト描画関数を使ってヘッダー描画をスキップ
        renderTopList : Types.ListValue -> Html mgs
        renderTopList (Types.ListValue list) =
            tbody [] (list |> List.map renderSValue)

        renderTopSValue : Types.SValue -> Html msg
        renderTopSValue v =
            case v of
                Types.L list ->
                    renderTopList list

                Types.D dict ->
                    renderDict dict

                Types.P (Types.PrimitiveValue v) ->
                    Html.text v
    in
        renderTopSValue v |> (\body -> table [ tableStyle ] [ renderHeader v, body ])


renderSValue : Types.SValue -> Html msg
renderSValue v =
    case v of
        Types.L list ->
            renderList list

        Types.D dict ->
            renderDict dict

        Types.P (Types.PrimitiveValue v) ->
            Html.text v


renderList : Types.ListValue -> Html mgs
renderList (Types.ListValue list) =
    let
        header =
            renderHeader <| Types.L <| Types.ListValue <| list
    in
        tbody [] ([ header ] ++ (list |> List.map renderSValue))


renderDict : Types.DictValue -> Html msg
renderDict (Types.DictValue dict) =
    let
        rowStyle =
            style
                [ "border" => "2px solid black"
                ]

        row =
            dict
                |> Dict.map
                    (\k v ->
                        case v of
                            _ ->
                                td [ rowStyle ] [ renderSValue v ]
                    )
                |> Dict.values
                |> tr []
    in
        row


main : Program String Model Msg
main =
    Html.programWithFlags
        { view = view
        , init = init
        , update = update
        , subscriptions = \_ -> Sub.batch [ receiveEvent (receivEventHelper >> ReceiveEvent) ]
        }
