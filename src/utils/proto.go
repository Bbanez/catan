package utils

import (
	"reflect"

	"google.golang.org/protobuf/proto"
)

func UnpackProto[P proto.Message](
	data []byte,
) (P, error) {
	var msg P
	msg = reflect.New(reflect.TypeOf(msg).Elem()).Interface().(P)
	err := proto.Unmarshal(data, msg)
	if err != nil {
		return msg, err
	}
	return msg, nil
}

func UnpackProtoWithTransform[P proto.Message, O any](
	data []byte,
	transform func(data P) (*O, error),
) (*O, error) {
	msg, err := UnpackProto[P](data)
	if err != nil {
		return nil, err
	}
	return transform(msg)
}

func PackProto[P proto.Message](data P) ([]byte, error) {
	b, err := proto.Marshal(data)
	if err != nil {
		return nil, err
	}
	return b, nil
}
