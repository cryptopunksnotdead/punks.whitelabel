# encoding: utf-8

###
#  to run use
#     ruby -I ./lib -I ./test test/test_bytes.rb


require 'helper'


class TestBytes < MiniTest::Test

  def test_hex
    assert String.new( "6162")  == Bytes.to_hex( "ab" )
    assert String.new( "6162")  == bytes_to_hex( "ab" )
    assert String.new( "6162")  == "ab".b_to_h
    assert String.new( "6162")  == "ab".btoh
    assert String.new( "6162")  == "ab".h
    assert String.new( "6162")  == Bytes.to_hex( "\x61\x62" )
    assert String.new( "6162")  == bytes_to_hex( "\x61\x62" )
    assert String.new( "6162")  == "\x61\x62".b_to_h
    assert String.new( "6162")  == "\x61\x62".btoh
    assert String.new( "6162")  == "\x61\x62".h
    assert Encoding::UTF_8      == Bytes.to_hex( "ab" ).encoding

    assert Bytes.new( "ab" )    == Bytes.from_hex( "6162" )
    assert Bytes.new( "ab" )    == hex_to_bytes( "6162" )
    assert Bytes.new( "ab" )    == "6162".h_to_b
    assert Bytes.new( "ab" )    == "6162".htob
    assert Bytes.new( "ab" )    == Bytes.from_hex( "0x6162" )
    assert Bytes.new( "ab" )    == hex_to_bytes( "0x6162" )
    assert Bytes.new( "ab" )    == "0x6162".h_to_b
    assert Bytes.new( "ab" )    == "0x6162".htob
    assert Encoding::ASCII_8BIT == Bytes.from_hex( "6162" ).encoding

    assert Bytes.new( "ab" )    == Bytes( "6162" )
    assert Bytes.new( "ab" )    == Bytes( "0x6162" )
    assert Bytes.new( "6162" )  == Bytes( "6162".b )
    assert Bytes.new( "ab" )    == Bytes( "ab".b )
    assert Bytes.new( "ab")     == Bytes( "\x61\x62".b )
    assert Encoding::ASCII_8BIT == Bytes( "6162" ).encoding
    assert Encoding::ASCII_8BIT == Bytes( "6162".b ).encoding
    assert Encoding::ASCII_8BIT == Bytes( "ab".b ).encoding
  end

end  # class TestBytes
