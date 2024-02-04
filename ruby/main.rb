require 'uri'
require 'net/http'
require 'nokogiri'
require 'sqlite3'

RESOURCE = "https://www.amazon.pl"
MAIN_PAGE_URI = URI(RESOURCE + "/s?k=bmw+f30+m+front+bumper&__mk_pl_PL=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1NC6LDEK10FX6&sprefix=bmw+f30+m+front+bumper%2Caps%2C75&ref=nb_sb_noss")

db = SQLite3::Database.new "products"

def get_page_with_products()
    req = Net::HTTP::Get.new(MAIN_PAGE_URI)
    req["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0"
    req["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    req["DNT"] = "1"
    req["Connection"] = "close"
    req["Upgrade-Insecure-Requests"] = "1"

    res = Net::HTTP.start(MAIN_PAGE_URI.hostname, MAIN_PAGE_URI.port, use_ssl: MAIN_PAGE_URI.scheme == "https") { |http|
        http.request(req)
    }

    return res.body
end

def parse_products_links(products_page)
    html_doc = Nokogiri::HTML(products_page)
    return html_doc.css('div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style').css('h2').css('a').map{|link| link['href']}

end

def get_product_page(link)
    uri = URI(RESOURCE + link)
    req = Net::HTTP::Get.new(uri)
    req["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0"
    req["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    req["DNT"] = "1"
    req["Connection"] = "close"
    req["Upgrade-Insecure-Requests"] = "1"

    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") { |http|
        http.request(req)
    }

    return res.body
end

def select_if_exist(html_doc, selector)
    res = html_doc.css('tr.po-item_weight.a-spacing-small td.a-span9 span')[0]
    return res ? res.text : ""
end

def parse_product_page(product_page)
    puts product_page
    html_doc = Nokogiri::HTML(product_page)
    data = { }
    data['name'] = html_doc.css('h1#title span#productTitle')[0].text
    data['price'] = html_doc.css('span.a-price-whole')[0].text + "." + html_doc.css('span.a-price-decimal')[0].text
    data['brand'] = html_doc.css('div#bylineInfo_feature_div div a')[0].text.split(':')[1]
    data['color'] = select_if_exist(html_doc, 'tr.po-color.a-spacing-small td.a-span9 span')
    data['weight'] = select_if_exist(html_doc, 'tr.po-item_weight.a-spacing-small td.a-span9 span')
    data['class'] = select_if_exist(html_doc, 'tr.po-product_grade.a-spacing-small td.a-span9 span')

    return data
end

def save_product_data(link, data)
    db.execute("INSERT INTO products (link, name, price, brand, color, weight, class)
                VALUES (?, ?, ?, ?, ?, ?, ?)", [ link, data['name'], data['price'], data['brand'], data['color'], data['weight'], data['class'] ])
end

def main()
    products_page = get_page_with_products()
    product_links = parse_products_links(products_page)
    products_data = []

    products_link.each |link| do
        product_page = get_product_page(link)
        product_data = parse_product_page(product_page)
        save_product_data(link, product_data)
    end
end

main()