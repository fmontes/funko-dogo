import ItemComponent from '../components/Item';
import { shallow } from 'enzyme';

const fakeItem = {
    id: 'ABC123',
    title: 'A cool item',
    price: 5000,
    description: 'This is a desc',
    image: 'dog.jpg',
    largeImage: 'largeDog.jpg'
}

describe('<Item />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<ItemComponent item={fakeItem} />);
    })

    it('renders the image properly', () => {
        const img = wrapper.find('img');
        expect(img.props().src).toBe(fakeItem.image);
        expect(img.props().alt).toBe(fakeItem.title);
    })

    it('renders the pricetag and title', () => {
        const PriceTag = wrapper.find('PriceTag');
        expect(PriceTag.children().text()).toBe('$50');
        expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
    });

    it('renders out the buttons properly', () => {
        const buttonList = wrapper.find('.buttonList');
        expect(buttonList.children()).toHaveLength(3);
        expect(buttonList.find('Link')).toHaveLength(1);
        expect(buttonList.find('AddToCart')).toHaveLength(1);
        expect(buttonList.find('DeleteItem')).toHaveLength(1);
    });
})