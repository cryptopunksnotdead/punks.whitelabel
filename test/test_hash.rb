# encoding: utf-8

###
#  to run use
#     ruby -I ./lib -I ./test test/test_hash.rb


require 'helper'


class TestHash < MiniTest::Test

  def test_hash
    sha256_empty_hex   = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    sha256_empty_bytes = "\xE3\xB0\xC4B\x98\xFC\x1C\x14\x9A\xFB\xF4\xC8\x99o\xB9$'\xAEA\xE4d\x9B\x93L\xA4\x95\x99\exR\xB8U".b

    assert_equal sha256_empty_bytes, sha256( "" )
    assert_equal sha256_empty_bytes, sha256( Bytes.new )

    assert_equal sha256_empty_hex, Bytes.to_hex( sha256( "" ) )
    assert_equal sha256_empty_hex, bytes_to_hex( sha256( "" ) )
    assert_equal sha256_empty_hex, btoh( sha256( "" ) )
    assert_equal sha256_empty_hex, sha256( "" ).h
    assert_equal sha256_empty_hex, sha256hex( "" )

    ripemd160_empty_hex = "9c1185a5c5e9fc54612808977ee8f548b2258d31"

    assert_equal ripemd160_empty_hex, Bytes.to_hex( ripemd160( "" ))
    assert_equal ripemd160_empty_hex, bytes_to_hex( ripemd160( "" ))
    assert_equal ripemd160_empty_hex, btoh( ripemd160( "" ))
    assert_equal ripemd160_empty_hex, ripemd160( "" ).h
    assert_equal ripemd160_empty_hex, ripemd160hex( "" )

    assert_equal "37f332f68db77bd9d7edd4969571ad671cf9dd3b",
      ripemd160hex( "The quick brown fox jumps over the lazy dog" )

    assert_equal "132072df690933835eb8b6ad0b77e7b6f14acad7",
      ripemd160hex( "The quick brown fox jumps over the lazy cog" )
  end

end  # class TestHash
