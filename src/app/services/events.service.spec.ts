import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EventsService } from './events.service';

describe('EventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [EventsService],
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: EventsService = TestBed.get(EventsService);
    expect(service).toBeTruthy();
  });
});
