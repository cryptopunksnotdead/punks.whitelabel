# encoding: utf-8

require 'pp'
require 'digest'


## our own code
require 'bytes/version'    # note: let version always go first


class Bytes
  def self.new( *args )
    String.new( *args ).b
  end

  def self.from_hex( hexstr )
    if ['0x', '0X'].include?( hexstr[0...2] )
      [hexstr[2..-1]].pack('H*')  ## cut-of leading 0x or 0X if present
    else
      [hexstr].pack('H*')
    end
  end

  def self.to_hex( str )
    # note: unpack returns string with <Encoding:US-ASCII>
    # conver to default encoding
    ##  todo/fix: do NOT hardcode UTF-8 - use default encoding - how?
    str.unpack('H*').first.encode("UTF-8")
  end

  def self.convert( *args )
    ## used by Bytes() in global Kernel converter method
    if args.size == 1
      if args[0].is_a? Array
        ## assume array of bytes
        ##   to be done
      else  ## assume String
        ## todo/fix: use coerce to_str if arg is NOT a string - why? why not?
        str = args[0]
        ##
        if str.encoding == Encoding::ASCII_8BIT
          ## assume it's binary data - use as is (no hexstring conversion)
          new( str )   ## todo/check: return str as-is (without new) - why? why not?
        else    ## assume it's a hexstring
          from_hex( str )
        end
      end
    else
      ## todo/fix: throw argument error
    end
  end
end


class Buffer
  def self.new( *args )
    if args.size == 0
      ## note: use "" to always use default encoding (and NOT binary)
      String.new( "" )
    else
      String.new( *args )
    end
  end
end


module BytesHelper
  def hex_to_bytes( hexstr ) Bytes.from_hex( hexstr); end
  alias_method :h_to_b, :hex_to_bytes
  alias_method :htob,   :hex_to_bytes

  def bytes_to_hex( str ) Bytes.to_hex( str ); end
  alias_method :b_to_h, :bytes_to_hex
  alias_method :btoh,   :bytes_to_hex
end



class String
  def h_to_b()  Bytes.from_hex( self ); end
  alias_method :htob, :h_to_b

  def b_to_h()  Bytes.to_hex( self ); end   ## add .b-like shortcut
  alias_method :btoh, :b_to_h
  alias_method :h,    :b_to_h
end


module HashHelper
  def sha256( bytes )
    ## todo/fix:  check bytes.encoding - warn if not BINARY!!!!
    Digest::SHA256.digest( bytes )
  end

  def ripemd160( bytes )
    ## todo/fix:  check bytes.encoding - warn if not BINARY!!!!
    Digest::RMD160.digest( bytes )
  end

  def hash256( bytes )
    ## double - uses sha256(sha256())
    sha256(sha256( bytes ))
  end

  def hash160( bytes )
    ## double - uses ripemd160(sha256())
    ripemd160(sha256( bytes ))
  end

  ## convenience shortcut helpers
  def sha256hex( bytes )    Bytes.to_hex(sha256( bytes ));    end
  def ripemd160hex( bytes ) Bytes.to_hex(ripemd160( bytes )); end
  def hash256( bytes )      Bytes.to_hex(hash256( bytes ));   end
  def hash160( bytes )      Bytes.to_hex(hash160( bytes ));   end
end

## make "global" for now - check if there's a better way (include in Kernel) - why? why ot?
include HashHelper
include BytesHelper



module Kernel
  def Bytes( *args )  Bytes.convert( *args ); end
end

puts Bytes.banner    ## say hello
