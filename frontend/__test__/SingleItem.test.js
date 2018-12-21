import SingleItem from '../components/SingleItem';
import { SINGLE_ITEM_QUERY } from '../components/SingleItem';
import { mount } from 'enzyme';
import toJSON, { toJson } from 'enzyme-to-json';
import wait from 'waait';
import { fakeItem } from '../lib/testUtils';
import { MockedProvider } from 'react-apollo/test-utils';

describe('<SingleItem />', () => {
    it('renders with proper data', async () => {
        const mocks = [
            {
                request: {
                    query: SINGLE_ITEM_QUERY,
                    variables: { id: '123' }
                },
                result: {
                    data: {
                        item: fakeItem()
                    }
                }
            }
        ];

        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <SingleItem id="123" />
            </MockedProvider>
        );

        expect(wrapper.text()).toContain('Loading...');

        await wait();
        wrapper.update();

        expect(toJSON(wrapper.find('h2'))).toMatchSnapshot();
        expect(toJSON(wrapper.find('img'))).toMatchSnapshot();
        expect(toJSON(wrapper.find('p'))).toMatchSnapshot();
    });

    it('Errors with no found items', async () => {
        const mocks = [
            {
                request: {
                    query: SINGLE_ITEM_QUERY,
                    variables: { id: '123' }
                },
                result: {
                    errors: [
                        {
                            message: 'Item not found'
                        }
                    ]
                }
            }
        ];

        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <SingleItem id="123" />
            </MockedProvider>
        );


        await wait();
        wrapper.update();

        const item = wrapper.find('[data-test="graphql-error"]');
        expect(item.text()).toContain('Item not found');
        expect(toJSON(item)).toMatchSnapshot();
    })
});
