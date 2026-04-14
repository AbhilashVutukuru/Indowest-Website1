import { TestBed } from '@angular/core/testing';
import { WebsiteContentService } from './website-content.service';

describe('WebsiteContentService', () => {
  let service: WebsiteContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsiteContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
