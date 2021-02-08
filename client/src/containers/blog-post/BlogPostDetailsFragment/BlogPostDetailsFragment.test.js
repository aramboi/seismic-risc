import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogPostDetailsFragment from './BlogPostDetailsFragment';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    slug: 'slug',
  }),
}));

jest.mock('../../../hooks/useWindowSize', () => ({
  __esModule: true,
  default: () => ({
    height: 768,
  }),
}));
afterEach(cleanup);

describe('BlogPostDetailsFragment component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render correctly', async () => {
    const blogPost = {
      title: 'Title',
      text: '<p>Text</p>',
      created: new Date(0),
      tags: ['tag1', 'tag2'],
      image: 'image-url',
      author_first_name: 'First',
      author_last_name: 'Last',
    };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(blogPost),
      status: 200,
    });
    const container = render(<BlogPostDetailsFragment />);
    await container.findByText('Title');
    expect(container.baseElement).toMatchSnapshot();
  });

  it('should render correctly if error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(null),
      status: 404,
    });
    const container = render(<BlogPostDetailsFragment />);
    await container.findByText('Nu a fost găsit');
    expect(container.baseElement).toMatchSnapshot();
  });
});
