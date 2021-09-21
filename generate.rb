###################
# to run use:
#
#   ruby ./generate.rb


require 'csvreader'
require 'pixelart'



def normalize( str )
  ## allow (ignore):
  ##    space ( ),
  ##    underscore (_),
  ##    dash (-)
  str.downcase.gsub( /[ _-]/, '' ).strip
end


def generate_punk( *values, dir: "./basic" )
  punk_type       = values[0]
  attribute_names = values[1..-1]

  punk_type = normalize( punk_type )
  path      = "#{dir}/#{punk_type}.png"
  punk = Image.read( path )

  m_or_f = if punk_type.index( 'female' )
             'f'
           else
             'm'
           end

  attribute_names.each do |attribute_name|
     next if attribute_name.nil? || attribute_name.empty?  ## note: skip nil or empty string attributes

     attribute_name = normalize( attribute_name )
     path           = "#{dir}/#{m_or_f}/#{attribute_name}.png"
     attribute      = Image.read( path )

     punk.compose!( attribute )
  end

  punk
end # method generate



###
# test drive
#  generate punk #0
punk = generate_punk( 'Female 2', 'Earring', 'Blonde Bob', 'Green Eye Shadow' )
punk.save( "./tmp/punk0.png" )
punk.zoom(20).save( "./tmp/punk0@20x.png" )

# generate punk #1
punk = generate_punk( 'Male 1', 'Smile', 'Mohawk' )
punk.save( "./tmp/punk1.png" )
punk.zoom(20).save( "./tmp/punk1@20x.png" )




##
# read in all meta data records of all 10 000 punks

recs = CsvHash.read( './punks.csv' )
puts "#{recs.size} punk(s)"  #=> 10000 punk(s)


##
# let's go - generate all 10 000 using the records

recs.each_with_index do |rec,i|
  puts "==> punk #{i}:"
  pp rec

  values = rec.values
  punk = generate_punk( *values )

  name = "punk#{i}"

  punk.save( "./o/#{name}.png" )
  punk.zoom(20).save( "./o/#{name}@20x.png" )
end



###
# bonus:
#  generate the all-in-one composite using a 100x100 grid

punks = CompositeImage.new( 100, 100 )

recs.each_with_index do |rec,i|
  values = rec.values
  punk = generate_punk( *values )

  punks << punk
end

punks.save( "./o/punks.png" )


puts "bye"

